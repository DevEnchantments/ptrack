import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RecordHistoryService } from '../../database/record-history.service';
import { MilestonesRepository } from './milestones.repository';
import { CreateMilestoneDto } from './dto/create-milestone.dto';
import { UpdateMilestoneDto } from './dto/update-milestone.dto';
import { AdjustWeightsDto } from './dto/adjust-weights.dto';

@Injectable()
export class MilestonesService {
  constructor(
    private readonly repo: MilestonesRepository,
    private readonly auditLog: RecordHistoryService,
  ) {}

  list(projectId: string) {
    return this.repo.findByProject(projectId);
  }

  async get(projectId: string, milestoneId: string) {
    const milestone = await this.repo.findOne(projectId, milestoneId);
    if (!milestone) throw new NotFoundException('Milestone not found.');
    return milestone;
  }

  async add(projectId: string, dto: CreateMilestoneDto, userId: string) {
    const created = await this.repo.insert({
      project_id: projectId,
      name: dto.name.trim(),
      description: dto.description?.trim() || null,
      start_date: dto.start_date,
      due_date: dto.due_date,
      // Frozen at creation: due_date may slip later, the original never moves.
      // Deliberately absent from UpdateMilestoneDto, so PATCH cannot touch it.
      original_due_date: dto.due_date,
      status: dto.status,
      role_id: dto.role_id ?? null,
      owner_id: dto.owner_id ?? null,
      is_major: dto.is_major ?? false,
      tags: dto.tags?.length ? dto.tags : null,
      weightage: dto.weightage ?? null,
      percent_complete: dto.percent_complete ?? null,
      outcome_id: dto.outcome_id ?? null,
      created_by: userId,
      updated_by: userId,
    });
    if (dto.depends_on?.length) {
      await this.repo.replaceDependencies(
        projectId,
        created.id,
        dto.depends_on,
      );
    }
    return created;
  }

  async update(
    projectId: string,
    milestoneId: string,
    dto: UpdateMilestoneDto,
    userId: string,
  ) {
    // Ensures the milestone exists in this project (404 otherwise).
    await this.get(projectId, milestoneId);

    // Build the column patch only from fields that were provided.
    const patch: Record<string, unknown> = { updated_by: userId };
    if (dto.name !== undefined) patch.name = dto.name.trim();
    if (dto.description !== undefined)
      patch.description = dto.description?.trim() || null;
    if (dto.start_date !== undefined) patch.start_date = dto.start_date;
    if (dto.due_date !== undefined) patch.due_date = dto.due_date;
    if (dto.status !== undefined) patch.status = dto.status;
    if (dto.role_id !== undefined) patch.role_id = dto.role_id ?? null;
    if (dto.owner_id !== undefined) patch.owner_id = dto.owner_id ?? null;
    if (dto.is_major !== undefined) patch.is_major = dto.is_major;
    if (dto.tags !== undefined) patch.tags = dto.tags?.length ? dto.tags : null;
    if (dto.weightage !== undefined) patch.weightage = dto.weightage ?? null;
    if (dto.percent_complete !== undefined)
      patch.percent_complete = dto.percent_complete ?? null;
    if (dto.depends_on !== undefined) {
      await this.repo.replaceDependencies(
        projectId,
        milestoneId,
        dto.depends_on ?? [],
      );
    }
    if (dto.outcome_id !== undefined) patch.outcome_id = dto.outcome_id ?? null;

    await this.repo.update(projectId, milestoneId, patch);

    // Return the fully-joined milestone so the UI can refresh.
    return this.get(projectId, milestoneId);
  }

  /**
   * UC-08 Adjust Weights. FDD 3.3.2: weights must total exactly 100 before
   * submission — enforced here on save; leaving every weight empty clears
   * them (equal weighting per FORMULAS.md F1).
   */
  async adjustWeights(
    projectId: string,
    dto: AdjustWeightsDto,
    userId: string,
  ) {
    if (dto.weights.length > 0) {
      const set = dto.weights
        .map((w) => w.weightage)
        .filter((w): w is number => w != null);
      const total = set.reduce((a, b) => a + b, 0);
      if (set.length > 0 && Math.abs(total - 100) > 0.001) {
        throw new BadRequestException(
          `Milestone weights must total exactly 100 (got ${total}).`,
        );
      }
      await Promise.all(
        dto.weights.map((w) =>
          this.repo.update(projectId, w.id, {
            weightage: w.weightage ?? null,
            updated_by: userId,
          }),
        ),
      );
    }
    return this.list(projectId);
  }

  async history(projectId: string, milestoneId: string) {
    await this.get(projectId, milestoneId); // 404 if not in this project
    return this.repo.findHistory(projectId, milestoneId);
  }

  async remove(projectId: string, milestoneId: string, userId: string) {
    const milestone = await this.get(projectId, milestoneId); // 404 if not in this project
    await this.repo.remove(projectId, milestoneId);
    await this.auditLog.logDeleted({
      table: 'milestones',
      recordId: milestoneId,
      projectId,
      label: milestone.name,
      userId,
    });
    return { deleted: true };
  }
}
