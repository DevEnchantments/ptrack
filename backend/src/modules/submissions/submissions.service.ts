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
  ) {}

  list(projectId: string) {
    return this.repo.findByProject(projectId);
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
    const existing = await this.repo.findForCycle(projectId, cycle.id);
    if (!existing) {
      return this.repo.insert({
        project_id: projectId,
        cycle_id: cycle.id,
        status: 'review',
        comment: dto.comment?.trim() || null,
        submitted_by: userId,
        submitted_at: new Date().toISOString(),
        created_by: userId,
        updated_by: userId,
      });
    }
    if (existing.status !== 'draft' && existing.status !== 'returned') {
      throw new BadRequestException(
        `Already submitted for ${cycle.name} (status: ${existing.status}).`,
      );
    }
    return this.repo.update(existing.id, {
      status: 'review',
      comment: dto.comment?.trim() || null,
      submitted_by: userId,
      submitted_at: new Date().toISOString(),
      updated_by: userId,
      updated_at: new Date().toISOString(),
    });
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
    if (!opts.from.includes(sub.status)) {
      throw new BadRequestException(
        `Cannot ${opts.to} a submission in status "${sub.status}".`,
      );
    }
    if (opts.actorField) {
      const project = await this.projects.findDetail(projectId);
      const requiredActor = project?.[opts.actorField];
      if (requiredActor && requiredActor !== userId) {
        throw new ForbiddenException(
          `Only the ${opts.actorLabel} can do this for this project.`,
        );
      }
    }
    return this.repo.update(submissionId, {
      status: opts.to,
      decision_comment: opts.comment?.trim() || null,
      [`${opts.stamp}_by`]: userId,
      [`${opts.stamp}_at`]: new Date().toISOString(),
      updated_by: userId,
      updated_at: new Date().toISOString(),
    });
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
