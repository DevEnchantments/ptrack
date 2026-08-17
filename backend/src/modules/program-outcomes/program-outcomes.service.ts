import { Injectable, NotFoundException } from '@nestjs/common';
import { RecordHistoryService } from '../../database/record-history.service';
import { ProgramOutcomesRepository } from './program-outcomes.repository';
import { CreateProgramOutcomeDto } from './dto/create-program-outcome.dto';
import { UpdateProgramOutcomeDto } from './dto/update-program-outcome.dto';
import { columnsFrom, type ColumnSpec } from '../../common/columns';

/**
 * How an outcome DTO maps onto columns, for both create and update.
 *
 * The dates are `nullable`, not `dateOrNull` as in projects/. The difference is
 * unreachable: `@IsDateString()` on the DTO rejects the only input the two
 * categories handle differently (`''`) with a 400 before this runs.
 */
const COLUMN_SPEC: ColumnSpec = {
  trimmed: ['name'],
  nullable: ['sort_order', 'start_date', 'end_date'],
};

/** What a new outcome gets for the columns the caller omitted. */
const CREATE_DEFAULTS = { start_date: null, end_date: null };

@Injectable()
export class ProgramOutcomesService {
  constructor(
    private readonly repo: ProgramOutcomesRepository,
    private readonly auditLog: RecordHistoryService,
  ) {}

  list(projectId: string) {
    return this.repo.findByProject(projectId);
  }

  async add(projectId: string, dto: CreateProgramOutcomeDto, userId: string) {
    return this.repo.insert({
      project_id: projectId,
      ...CREATE_DEFAULTS,
      ...columnsFrom(dto, COLUMN_SPEC),
      sort_order: dto.sort_order ?? (await this.nextSortOrder(projectId)),
      created_by: userId,
      updated_by: userId,
    });
  }

  /**
   * Fig 2 outcomes are numbered; a create that omits the number takes the next
   * one in the project. Costs one read, so it only runs when needed.
   *
   * Highest-in-use + 1, not count + 1: with outcomes 1-2-3, deleting #2 leaves
   * a count of 2, which handed the next insert a colliding 3. Unnumbered rows
   * do not participate.
   *
   * Still not safe against two simultaneous creates — that needs a unique
   * constraint or a sequence, i.e. a schema change.
   */
  private async nextSortOrder(projectId: string): Promise<number> {
    const existing = await this.repo.findByProject(projectId);
    const highest = existing.reduce(
      (max, o) => Math.max(max, o.sort_order ?? 0),
      0,
    );
    return highest + 1;
  }

  async update(
    projectId: string,
    outcomeId: string,
    dto: UpdateProgramOutcomeDto,
    userId: string,
  ) {
    const updated = await this.repo.update(projectId, outcomeId, {
      updated_by: userId,
      // No moddatetime trigger on this table; keep the audit column honest.
      updated_at: new Date().toISOString(),
      ...columnsFrom(dto, COLUMN_SPEC),
    });
    if (!updated) throw new NotFoundException('Outcome not found.');
    return updated;
  }

  async remove(projectId: string, outcomeId: string, userId: string) {
    const deleted = await this.repo.remove(projectId, outcomeId);
    if (!deleted) throw new NotFoundException('Outcome not found.');
    await this.auditLog.logDeleted({
      table: 'program_outcomes',
      recordId: deleted.id,
      projectId,
      label: deleted.label,
      userId,
    });
    return { deleted: true };
  }
}
