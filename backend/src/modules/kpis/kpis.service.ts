import { Injectable, NotFoundException } from '@nestjs/common';
import { KpisRepository } from './kpis.repository';
import { CreateKpiDto } from './dto/create-kpi.dto';
import {
  CreateKpiActionPlanDto,
  CreateKpiReadingDto,
  UpdateKpiActionPlanDto,
  UpdateKpiDto,
} from './dto/kpi-children.dto';
import { columnsFrom, type ColumnSpec } from '../../common/columns';

/** How a KPI DTO maps onto columns, for both create and update. */
const COLUMN_SPEC: ColumnSpec = {
  trimmed: ['name'],
  trimmedOrNull: [
    'description',
    'pillar',
    'entity',
    'unit',
    'data_source',
    'calculation_method',
    'rationale',
  ],
  nullable: [
    'baseline',
    'target',
    'tier_id',
    'objective_id',
    'owner_id',
    'project_id',
  ],
  asIs: ['polarity', 'decimal_places', 'frequency', 'is_priority'],
};

/**
 * Registry defaults. `decimal_places: 0` is a real value rather than a blank,
 * which is why it is a default here and `asIs` above.
 */
const CREATE_DEFAULTS = {
  description: null,
  pillar: null,
  entity: null,
  unit: null,
  polarity: 'higher_is_better',
  decimal_places: 0,
  data_source: null,
  calculation_method: null,
  frequency: 'monthly',
  rationale: null,
  baseline: null,
  target: null,
  is_priority: false,
  tier_id: null,
  objective_id: null,
  owner_id: null,
  project_id: null,
};

/**
 * FDD 1.8 KPI registry (Figs 27-29). Achievement % and the data-quality index
 * are deliberately NOT computed — those formulas await sign-off
 * (docs/FORMULAS.md); this module stores definitions, readings, and plans.
 */
@Injectable()
export class KpisService {
  constructor(private readonly repo: KpisRepository) {}

  list() {
    return this.repo.findAll();
  }

  async get(kpiId: string) {
    const kpi = await this.repo.findOne(kpiId);
    if (!kpi) throw new NotFoundException('KPI not found.');
    return kpi;
  }

  add(dto: CreateKpiDto, userId: string) {
    return this.repo.insert({
      ...CREATE_DEFAULTS,
      ...columnsFrom(dto, COLUMN_SPEC),
      created_by: userId,
      updated_by: userId,
    });
  }

  async update(kpiId: string, dto: UpdateKpiDto, userId: string) {
    const updated = await this.repo.update(kpiId, {
      updated_by: userId,
      // No moddatetime trigger on this table; keep the audit column honest.
      updated_at: new Date().toISOString(),
      ...columnsFrom(dto, COLUMN_SPEC),
    });
    if (!updated) throw new NotFoundException('KPI not found.');
    return updated;
  }

  async remove(kpiId: string) {
    const deleted = await this.repo.remove(kpiId);
    if (!deleted) throw new NotFoundException('KPI not found.');
    return { deleted: true };
  }

  async addReading(kpiId: string, dto: CreateKpiReadingDto, userId: string) {
    await this.get(kpiId);
    return this.repo.insertReading({
      kpi_id: kpiId,
      reading_date: dto.reading_date,
      value: dto.value,
      performance_analysis: dto.performance_analysis?.trim() || null,
      created_by: userId,
    });
  }

  async removeReading(kpiId: string, readingId: string) {
    const deleted = await this.repo.removeReading(kpiId, readingId);
    if (!deleted) throw new NotFoundException('Reading not found.');
    return { deleted: true };
  }

  async addPlan(kpiId: string, dto: CreateKpiActionPlanDto, userId: string) {
    await this.get(kpiId);
    return this.repo.insertPlan({
      kpi_id: kpiId,
      description: dto.description.trim(),
      owner: dto.owner?.trim() || null,
      due_date: dto.due_date ?? null,
      status: dto.status ?? 'open',
      created_by: userId,
    });
  }

  async updatePlan(kpiId: string, planId: string, dto: UpdateKpiActionPlanDto) {
    const patch: Record<string, unknown> = {};
    if (dto.description !== undefined)
      patch.description = dto.description?.trim();
    if (dto.owner !== undefined) patch.owner = dto.owner?.trim() || null;
    if (dto.due_date !== undefined) patch.due_date = dto.due_date ?? null;
    if (dto.status !== undefined) patch.status = dto.status;
    const updated = await this.repo.updatePlan(kpiId, planId, patch);
    if (!updated) throw new NotFoundException('Action plan not found.');
    return { ok: true };
  }

  async removePlan(kpiId: string, planId: string) {
    const deleted = await this.repo.removePlan(kpiId, planId);
    if (!deleted) throw new NotFoundException('Action plan not found.');
    return { deleted: true };
  }
}
