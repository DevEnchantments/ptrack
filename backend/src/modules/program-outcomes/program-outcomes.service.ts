import { Injectable, NotFoundException } from '@nestjs/common';
import { RecordHistoryService } from '../../database/record-history.service';
import { ProgramOutcomesRepository } from './program-outcomes.repository';
import { CreateProgramOutcomeDto } from './dto/create-program-outcome.dto';
import { UpdateProgramOutcomeDto } from './dto/update-program-outcome.dto';

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
    // Fig 2 outcomes are numbered; default to next-in-project when omitted.
    let sortOrder = dto.sort_order ?? null;
    if (sortOrder === null) {
      const existing = await this.repo.findByProject(projectId);
      sortOrder = existing.length + 1;
    }
    return this.repo.insert({
      project_id: projectId,
      name: dto.name.trim(),
      sort_order: sortOrder,
      start_date: dto.start_date ?? null,
      end_date: dto.end_date ?? null,
      created_by: userId,
      updated_by: userId,
    });
  }

  async update(
    projectId: string,
    outcomeId: string,
    dto: UpdateProgramOutcomeDto,
    userId: string,
  ) {
    const patch: Record<string, unknown> = {
      updated_by: userId,
      // No moddatetime trigger on this table; keep the audit column honest.
      updated_at: new Date().toISOString(),
    };
    if (dto.name !== undefined) patch.name = dto.name.trim();
    if (dto.sort_order !== undefined) patch.sort_order = dto.sort_order ?? null;
    if (dto.start_date !== undefined) patch.start_date = dto.start_date ?? null;
    if (dto.end_date !== undefined) patch.end_date = dto.end_date ?? null;
    const updated = await this.repo.update(projectId, outcomeId, patch);
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
