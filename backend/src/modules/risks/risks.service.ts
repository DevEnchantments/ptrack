import { Injectable, NotFoundException } from '@nestjs/common';
import { RecordHistoryService } from '../../database/record-history.service';
import { RisksRepository } from './risks.repository';
import { CreateRiskDto } from './dto/create-risk.dto';
import { UpdateRiskDto } from './dto/update-risk.dto';

@Injectable()
export class RisksService {
  constructor(
    private readonly repo: RisksRepository,
    private readonly auditLog: RecordHistoryService,
  ) {}

  list(projectId: string) {
    return this.repo.findByProject(projectId);
  }

  add(projectId: string, dto: CreateRiskDto, userId: string) {
    return this.repo.insert({
      project_id: projectId,
      statement: dto.statement.trim(),
      identified_by: dto.identified_by?.trim() || null,
      date_identified: dto.date_identified || null,
      source_id: dto.source_id ?? null,
      category_id: dto.category_id ?? null,
      owner_id: dto.owner_id ?? null,
      probability_id: dto.probability_id ?? null,
      impact_id: dto.impact_id ?? null,
      response_id: dto.response_id ?? null,
      response_plan: dto.response_plan?.trim() || null,
      priority: dto.priority?.trim() || null,
      action: dto.action?.trim() || null,
      status: dto.status ?? 'open',
      type: dto.type ?? 'risk',
      created_by: userId,
      updated_by: userId,
    });
  }

  update(
    projectId: string,
    riskId: string,
    dto: UpdateRiskDto,
    userId: string,
  ) {
    const patch: Record<string, unknown> = {
      updated_by: userId,
      // No moddatetime trigger on this table; keep the audit column honest.
      updated_at: new Date().toISOString(),
    };
    if (dto.statement !== undefined) patch.statement = dto.statement.trim();
    if (dto.identified_by !== undefined)
      patch.identified_by = dto.identified_by?.trim() || null;
    if (dto.date_identified !== undefined)
      patch.date_identified = dto.date_identified || null;
    if (dto.source_id !== undefined) patch.source_id = dto.source_id ?? null;
    if (dto.category_id !== undefined)
      patch.category_id = dto.category_id ?? null;
    if (dto.owner_id !== undefined) patch.owner_id = dto.owner_id ?? null;
    if (dto.probability_id !== undefined)
      patch.probability_id = dto.probability_id ?? null;
    if (dto.impact_id !== undefined) patch.impact_id = dto.impact_id ?? null;
    if (dto.response_id !== undefined)
      patch.response_id = dto.response_id ?? null;
    if (dto.response_plan !== undefined)
      patch.response_plan = dto.response_plan?.trim() || null;
    if (dto.priority !== undefined)
      patch.priority = dto.priority?.trim() || null;
    if (dto.action !== undefined) patch.action = dto.action?.trim() || null;
    if (dto.status !== undefined) patch.status = dto.status;
    if (dto.type !== undefined) patch.type = dto.type;
    return this.repo.update(projectId, riskId, patch);
  }

  async remove(projectId: string, riskId: string, userId: string) {
    const deleted = await this.repo.remove(projectId, riskId);
    if (!deleted) throw new NotFoundException('Risk not found.');
    await this.auditLog.logDeleted({
      table: 'risks',
      recordId: deleted.id,
      projectId,
      label: deleted.label,
      userId,
    });
    return { deleted: true };
  }
}
