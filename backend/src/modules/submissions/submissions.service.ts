import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProjectsRepository } from '../projects';
import { MilestonesRepository } from '../milestones';
import { SubmissionsRepository } from './submissions.repository';
import { SubmissionActionDto } from './dto/submission-action.dto';
import { NotificationsService } from '../notifications';
import { ProjectAccessService } from '../../common/access/project-access.service';
import { submissionGateFailures } from './submissions.gate';
import {
  TRANSITIONS,
  type TransitionName,
  type TransitionSpec,
} from './submissions.workflow';

/**
 * FR-14 workflow: draft/returned -> review -> validated -> approved, with
 * returned and rejected branches. The machine itself lives in
 * `submissions.workflow.ts`; this service is the part that touches the
 * database, checks the cycle, and enforces who may act.
 */
@Injectable()
export class SubmissionsService {
  constructor(
    private readonly repo: SubmissionsRepository,
    private readonly projects: ProjectsRepository,
    private readonly milestones: MilestonesRepository,
    private readonly notifications: NotificationsService,
    private readonly access: ProjectAccessService,
  ) {}

  list(projectId: string) {
    return this.repo.findByProject(projectId);
  }

  /** UC-15-adjacent: portfolio-wide submission status for the current cycle. */
  async cycleStatus(userId: string) {
    const cycle = await this.repo.findCycleFor(new Date());
    // FR-15: the portfolio table hides restricted projects the caller
    // cannot see.
    const hidden = await this.access.hiddenProjectIds(userId);
    const projects = (await this.projects.findAll()).filter(
      (p) => !hidden.has(p.id),
    );
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

  async submit(projectId: string, dto: SubmissionActionDto, userId: string) {
    const project = await this.projects.findDetail(projectId);
    if (!project) throw new NotFoundException('Project not found.');
    const failures = submissionGateFailures(
      project,
      await this.milestones.findByProject(projectId),
    );
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
    const notifyValidator = () =>
      this.notifications.notify({
        userId: project.pmo_partner_id,
        actorId: userId,
        projectId,
        type: 'submission_review',
        title: `${project.name} awaits validation`,
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
    if (!resubmitted) throw new NotFoundException('Submission not found.');
    await notifyValidator();
    return resubmitted;
  }

  validate(
    projectId: string,
    id: string,
    dto: SubmissionActionDto,
    userId: string,
  ) {
    return this.apply('validate', projectId, id, dto, userId);
  }

  approve(
    projectId: string,
    id: string,
    dto: SubmissionActionDto,
    userId: string,
  ) {
    return this.apply('approve', projectId, id, dto, userId);
  }

  returnSubmission(
    projectId: string,
    id: string,
    dto: SubmissionActionDto,
    userId: string,
  ) {
    return this.apply('return', projectId, id, dto, userId);
  }

  reject(
    projectId: string,
    id: string,
    dto: SubmissionActionDto,
    userId: string,
  ) {
    return this.apply('reject', projectId, id, dto, userId);
  }

  /**
   * One path for every verb: find it, check the cycle and the status, check
   * who is asking, write the stamps, tell whoever the workflow says to tell.
   */
  private async apply(
    name: TransitionName,
    projectId: string,
    submissionId: string,
    dto: SubmissionActionDto,
    userId: string,
  ) {
    const spec: TransitionSpec = TRANSITIONS[name];
    const sub = await this.repo.findOne(projectId, submissionId);
    if (!sub) throw new NotFoundException('Submission not found.');
    if (sub.cycle?.status === 'closed') {
      throw new BadRequestException(
        `The ${sub.cycle.name} cycle is closed; decisions are locked.`,
      );
    }
    if (!spec.from.includes(sub.status)) {
      throw new BadRequestException(
        `Cannot ${spec.to} a submission in status "${sub.status}".`,
      );
    }

    const project = await this.projects.findDetail(projectId);
    if (spec.actor) {
      const required = project?.[spec.actor.field];
      // Enforced only when the project names someone: an unset field means
      // the step is open to anyone.
      if (required && required !== userId) {
        throw new ForbiddenException(
          `Only the ${spec.actor.label} can do this for this project.`,
        );
      }
    }

    const comment = dto.comment?.trim() || null;
    const updated = await this.repo.update(submissionId, {
      status: spec.to,
      decision_comment: comment,
      [`${spec.stamp}_by`]: userId,
      [`${spec.stamp}_at`]: new Date().toISOString(),
      updated_by: userId,
      updated_at: new Date().toISOString(),
    });
    if (!updated) throw new NotFoundException('Submission not found.');

    // FDD 3.9 event notifications (in-app; best-effort).
    await this.notifications.notify({
      ...spec.notify({
        projectName: project?.name ?? 'A project',
        cycleName: sub.cycle?.name ?? 'this cycle',
        submittedBy: sub.submitted_by,
        ownerId: project?.owner_id,
        comment,
      }),
      actorId: userId,
      projectId,
    });
    return updated;
  }
}
