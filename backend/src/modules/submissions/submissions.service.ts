import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProjectsRepository } from '../projects/projects.repository';
import { MilestonesRepository } from '../milestones/milestones.repository';
import { SubmissionsRepository } from './submissions.repository';
import { SubmissionActionDto } from './dto/submission-action.dto';
import { NotificationsService } from '../notifications/notifications.service';

/**
 * FR-14 workflow (routing ASSUMED per Fig 10 — see FDD-ALIGNMENT 1.6):
 * draft/returned -> review -> validated -> approved, with returned/rejected
 * branches. PMO Partner validates and Project Owner approves, enforced only
 * when the project's person field is set.
 */
@Injectable()
export class SubmissionsService {
  constructor(
    private readonly repo: SubmissionsRepository,
    private readonly projects: ProjectsRepository,
    private readonly milestones: MilestonesRepository,
    private readonly notifications: NotificationsService,
  ) {}

  list(projectId: string) {
    return this.repo.findByProject(projectId);
  }

  /** UC-15-adjacent: portfolio-wide submission status for the current cycle. */
  async cycleStatus() {
    const cycle = await this.repo.findCycleFor(new Date());
    const projects = await this.projects.findAll();
    const byProject = new Map<
      string,
      { status: string; submitted_at: string | null }
    >();
    if (cycle) {
      for (const s of await this.repo.findByCycle(cycle.id)) {
        byProject.set(s.project_id, {
          status: s.status,
          submitted_at: s.submitted_at,
        });
      }
    }
    return {
      cycle,
      rows: projects.map((p) => ({
        project_id: p.id,
        name: p.name,
        owner: p.owner?.full_name ?? p.owner?.email ?? null,
        project_manager:
          p.project_manager?.full_name ?? p.project_manager?.email ?? null,
        status: byProject.get(p.id)?.status ?? 'not_submitted',
        submitted_at: byProject.get(p.id)?.submitted_at ?? null,
      })),
    };
  }

  /** The stored cycle for the current month, if any (null = implicit open). */
  async currentCycle() {
    return { cycle: await this.repo.findCycleFor(new Date()) };
  }

  /**
   * FR-14 closure (ASSUMED: close locks ALL transitions — submit, validate,
   * approve, return, reject — exact rules are OI-03). Idempotent.
   */
  async closeCurrentCycle() {
    const cycle = await this.repo.getOrCreateCycleFor(new Date());
    if (cycle.status === 'closed') return cycle;
    return this.repo.setCycleStatus(cycle.id, 'closed');
  }

  /** Reopen escape hatch (enhancement): unlocks a mistakenly closed cycle. */
  async reopenCurrentCycle() {
    const cycle = await this.repo.findCycleFor(new Date());
    if (!cycle)
      throw new NotFoundException('No cycle exists for the current month.');
    if (cycle.status === 'open') return cycle;
    return this.repo.setCycleStatus(cycle.id, 'open');
  }

  /** FDD 3.3.2 submission gate: mandatory fields + weights total 100. */
  private async gateFailures(projectId: string): Promise<string[]> {
    const project = await this.projects.findDetail(projectId);
    if (!project) throw new NotFoundException('Project not found.');
    const failures: string[] = [];
    const mandatory: Array<[unknown, string]> = [
      [project.name, 'name'],
      [project.reference_id, 'reference ID'],
      [project.plan_year, 'plan year'],
      [project.owner_id, 'project owner'],
      [project.sponsor, 'sponsor'],
      [project.sector_id, 'sector'],
      [project.target_end_date, 'target end date'],
      [project.approved_budget, 'approved budget'],
    ];
    for (const [value, label] of mandatory) {
      if (value == null || value === '') failures.push(`missing ${label}`);
    }
    const ms = await this.milestones.findByProject(projectId);
    const active = ms.filter((m) => m.status !== 'not_applicable');
    if (active.length > 0) {
      const total = active.reduce((sum, m) => sum + (m.weightage ?? 0), 0);
      if (Math.abs(total - 100) > 0.001)
        failures.push(`milestone weights total ${total}, not 100`);
    }
    return failures;
  }

  async submit(projectId: string, dto: SubmissionActionDto, userId: string) {
    const failures = await this.gateFailures(projectId);
    if (failures.length > 0) {
      throw new BadRequestException(
        `Submission blocked: ${failures.join('; ')}.`,
      );
    }
    const cycle = await this.repo.getOrCreateCycleFor(new Date());
    if (cycle.status === 'closed') {
      throw new BadRequestException(
        `The ${cycle.name} cycle is closed; submissions are locked.`,
      );
    }
    const existing = await this.repo.findForCycle(projectId, cycle.id);
    const project = await this.projects.findDetail(projectId);
    const notifyValidator = () =>
      this.notifications.notify({
        userId: project?.pmo_partner_id,
        actorId: userId,
        projectId,
        type: 'submission_review',
        title: `${project?.name ?? 'A project'} awaits validation`,
        body: `The ${cycle.name} submission was sent for review.`,
      });
    if (!existing) {
      const created = await this.repo.insert({
        project_id: projectId,
        cycle_id: cycle.id,
        status: 'review',
        comment: dto.comment?.trim() || null,
        submitted_by: userId,
        submitted_at: new Date().toISOString(),
        created_by: userId,
        updated_by: userId,
      });
      await notifyValidator();
      return created;
    }
    if (existing.status !== 'draft' && existing.status !== 'returned') {
      throw new BadRequestException(
        `Already submitted for ${cycle.name} (status: ${existing.status}).`,
      );
    }
    const resubmitted = await this.repo.update(existing.id, {
      status: 'review',
      comment: dto.comment?.trim() || null,
      submitted_by: userId,
      submitted_at: new Date().toISOString(),
      updated_by: userId,
      updated_at: new Date().toISOString(),
    });
    await notifyValidator();
    return resubmitted;
  }

  private async transition(
    projectId: string,
    submissionId: string,
    userId: string,
    opts: {
      from: string[];
      to: string;
      /** projects column that names the only allowed actor (when set). */
      actorField?: 'pmo_partner_id' | 'owner_id';
      actorLabel?: string;
      stamp: 'validated' | 'approved' | 'returned';
      comment?: string | null;
    },
  ) {
    const sub = await this.repo.findOne(projectId, submissionId);
    if (!sub) throw new NotFoundException('Submission not found.');
    if (sub.cycle?.status === 'closed') {
      throw new BadRequestException(
        `The ${sub.cycle.name} cycle is closed; decisions are locked.`,
      );
    }
    if (!opts.from.includes(sub.status)) {
      throw new BadRequestException(
        `Cannot ${opts.to} a submission in status "${sub.status}".`,
      );
    }
    const project = await this.projects.findDetail(projectId);
    if (opts.actorField) {
      const requiredActor = project?.[opts.actorField];
      if (requiredActor && requiredActor !== userId) {
        throw new ForbiddenException(
          `Only the ${opts.actorLabel} can do this for this project.`,
        );
      }
    }
    const updated = await this.repo.update(submissionId, {
      status: opts.to,
      decision_comment: opts.comment?.trim() || null,
      [`${opts.stamp}_by`]: userId,
      [`${opts.stamp}_at`]: new Date().toISOString(),
      updated_by: userId,
      updated_at: new Date().toISOString(),
    });

    // FDD 3.9 event notifications (in-app; best-effort).
    const name = project?.name ?? 'A project';
    const cycleName = sub.cycle?.name ?? 'this cycle';
    if (opts.to === 'validated') {
      await this.notifications.notify({
        userId: project?.owner_id,
        actorId: userId,
        projectId,
        type: 'submission_validated',
        title: `${name} awaits approval`,
        body: `The ${cycleName} submission was validated.`,
      });
    } else if (opts.to === 'approved') {
      await this.notifications.notify({
        userId: sub.submitted_by,
        actorId: userId,
        projectId,
        type: 'submission_approved',
        title: `${name}: submission approved`,
        body: `Your ${cycleName} submission was approved.`,
      });
    } else if (opts.to === 'returned' || opts.to === 'rejected') {
      await this.notifications.notify({
        userId: sub.submitted_by,
        actorId: userId,
        projectId,
        type: `submission_${opts.to}`,
        title: `${name}: submission ${opts.to}`,
        body:
          opts.comment?.trim() ||
          `Your ${cycleName} submission was ${opts.to}.`,
      });
    }
    return updated;
  }

  validate(
    projectId: string,
    id: string,
    dto: SubmissionActionDto,
    userId: string,
  ) {
    return this.transition(projectId, id, userId, {
      from: ['review'],
      to: 'validated',
      actorField: 'pmo_partner_id',
      actorLabel: 'PMO Partner',
      stamp: 'validated',
      comment: dto.comment,
    });
  }

  approve(
    projectId: string,
    id: string,
    dto: SubmissionActionDto,
    userId: string,
  ) {
    return this.transition(projectId, id, userId, {
      from: ['validated'],
      to: 'approved',
      actorField: 'owner_id',
      actorLabel: 'Project Owner',
      stamp: 'approved',
      comment: dto.comment,
    });
  }

  returnSubmission(
    projectId: string,
    id: string,
    dto: SubmissionActionDto,
    userId: string,
  ) {
    return this.transition(projectId, id, userId, {
      from: ['review', 'validated'],
      to: 'returned',
      stamp: 'returned',
      comment: dto.comment,
    });
  }

  reject(
    projectId: string,
    id: string,
    dto: SubmissionActionDto,
    userId: string,
  ) {
    return this.transition(projectId, id, userId, {
      from: ['review', 'validated'],
      to: 'rejected',
      stamp: 'returned',
      comment: dto.comment,
    });
  }
}
