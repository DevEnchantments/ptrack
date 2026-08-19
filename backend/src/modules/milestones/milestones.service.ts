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
import { columnsFrom, type ColumnSpec } from '../../common/columns';

/**
 * How a milestone DTO maps onto columns, for both create and update.
 *
 * Dates are `asIs` here, where projects/ uses `dateOrNull` — a difference that
 * cannot show up in practice: the DTO validates them with `@IsDateString()`, so
 * the only input the two categories treat differently (`''`) is rejected with a
 * 400 before this runs. Kept as-is rather than "harmonised", which would be
 * churn on an unreachable branch.
 */
const COLUMN_SPEC: ColumnSpec = {
  trimmed: ['name'],
  trimmedOrNull: ['description'],
  nullable: [
    'role_id',
    'owner_id',
    'weightage',
    'percent_complete',
    'outcome_id',
  ],
  arrayOrNull: ['tags'],
  asIs: ['start_date', 'due_date', 'status', 'is_major'],
};

/** What a new milestone gets for the columns the caller omitted. */
const CREATE_DEFAULTS = {
  description: null,
  role_id: null,
  owner_id: null,
  is_major: false,
  tags: null,
  weightage: null,
  percent_complete: null,
  outcome_id: null,
};

/** FDD 3.3.2: milestone weights must total exactly this before submission. */
const WEIGHT_TOTAL = 100;

/** Floating-point slack, so 33.333 + 33.333 + 33.334 is accepted. */
const WEIGHT_TOLERANCE = 0.001;

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
      ...CREATE_DEFAULTS,
      ...columnsFrom(dto, COLUMN_SPEC),
      // Frozen at creation: due_date may slip later, the original never moves.
      // Deliberately absent from UpdateMilestoneDto, so PATCH cannot touch it.
      original_due_date: dto.due_date,
      created_by: userId,
      updated_by: userId,
    });
    // Guarded on `?.length`, not `!== undefined` as in update(): a row inserted
    // microseconds ago cannot have dependencies yet, so an empty set here would
    // spend a DELETE round-trip clearing nothing. Not an inconsistency.
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

    // Dependencies live in a join table, not on the milestone row, so they are
    // replaced separately — and an explicit [] means "clear the set".
    if (dto.depends_on !== undefined) {
      await this.repo.replaceDependencies(
        projectId,
        milestoneId,
        dto.depends_on ?? [],
      );
    }

    const written = await this.repo.update(projectId, milestoneId, {
      updated_by: userId,
      ...columnsFrom(dto, COLUMN_SPEC),
    });
    // The get() above already 404s for a foreign id; this catches the row
    // being deleted in between, which used to surface as a 500.
    if (!written) throw new NotFoundException('Milestone not found.');

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
      this.assertWeightsTotal(dto);
      // One atomic RPC (db/adjust_milestone_weights.sql): N independent
      // updates could partially fail and leave the total broken.
      await this.repo.adjustWeights(
        projectId,
        dto.weights.map((w) => w.id),
        dto.weights.map((w) => w.weightage ?? null),
        userId,
      );
    }
    return this.list(projectId);
  }

  /**
   * Weights that carry a number must total WEIGHT_TOTAL. Leaving every weight
   * empty is allowed and clears them, which F1 reads as equal weighting.
   */
  private assertWeightsTotal(dto: AdjustWeightsDto): void {
    const set = dto.weights
      .map((w) => w.weightage)
      .filter((w): w is number => w != null);
    if (set.length === 0) return;

    const total = set.reduce((a, b) => a + b, 0);
    if (Math.abs(total - WEIGHT_TOTAL) > WEIGHT_TOLERANCE) {
      throw new BadRequestException(
        `Milestone weights must total exactly ${WEIGHT_TOTAL} (got ${total}).`,
      );
    }
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
