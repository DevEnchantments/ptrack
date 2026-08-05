import { Injectable, NotFoundException } from '@nestjs/common';
import { KpisRepository } from './kpis.repository';
import { CreateKpiDto } from './dto/create-kpi.dto';
import {
  CreateKpiActionPlanDto,
  CreateKpiReadingDto,
  UpdateKpiActionPlanDto,
  UpdateKpiDto,
} from './dto/kpi-children.dto';

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
      name: dto.name.trim(),
      description: dto.description?.trim() || null,
      pillar: dto.pillar?.trim() || null,
      entity: dto.entity?.trim() || null,
      unit: dto.unit?.trim() || null,
      polarity: dto.polarity ?? 'higher_is_better',
      decimal_places: dto.decimal_places ?? 0,
      data_source: dto.data_source?.trim() || null,
      calculation_method: dto.calculation_method?.trim() || null,
      frequency: dto.frequency ?? 'monthly',
      rationale: dto.rationale?.trim() || null,
      baseline: dto.baseline ?? null,
      target: dto.target ?? null,
      is_priority: dto.is_priority ?? false,
      tier_id: dto.tier_id ?? null,
      objective_id: dto.objective_id ?? null,
      owner_id: dto.owner_id ?? null,
      created_by: userId,
      updated_by: userId,
    });
  }

  async update(kpiId: string, dto: UpdateKpiDto, userId: string) {
    const patch: Record<string, unknown> = {
      updated_by: userId,
      updated_at: new Date().toISOString(),
    };
    if (dto.name !== undefined) patch.name = dto.name.trim();
    if (dto.description !== undefined)
      patch.description = dto.description?.trim() || null;
    if (dto.pillar !== undefined) patch.pillar = dto.pillar?.trim() || null;
    if (dto.entity !== undefined) patch.entity = dto.entity?.trim() || null;
    if (dto.unit !== undefined) patch.unit = dto.unit?.trim() || null;
    if (dto.polarity !== undefined) patch.polarity = dto.polarity;
    if (dto.decimal_places !== undefined)
      patch.decimal_places = dto.decimal_places ?? 0;
    if (dto.data_source !== undefined)
      patch.data_source = dto.data_source?.trim() || null;
    if (dto.calculation_method !== undefined)
      patch.calculation_method = dto.calculation_method?.trim() || null;
    if (dto.frequency !== undefined) patch.frequency = dto.frequency;
    if (dto.rationale !== undefined)
      patch.rationale = dto.rationale?.trim() || null;
    if (dto.baseline !== undefined) patch.baseline = dto.baseline ?? null;
    if (dto.target !== undefined) patch.target = dto.target ?? null;
    if (dto.is_priority !== undefined) patch.is_priority = dto.is_priority;
    if (dto.tier_id !== undefined) patch.tier_id = dto.tier_id ?? null;
    if (dto.objective_id !== undefined)
      patch.objective_id = dto.objective_id ?? null;
    if (dto.owner_id !== undefined) patch.owner_id = dto.owner_id ?? null;
    const updated = await this.repo.update(kpiId, patch);
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

  removeReading(kpiId: string, readingId: string) {
    return this.repo.removeReading(kpiId, readingId);
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
    await this.repo.updatePlan(kpiId, planId, patch);
    return { ok: true };
  }

  async removePlan(kpiId: string, planId: string) {
    await this.repo.removePlan(kpiId, planId);
    return { deleted: true };
  }
}
