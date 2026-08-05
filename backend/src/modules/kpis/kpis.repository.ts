import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { toHttpException } from '../../common/supabase-error';

export interface KpiReading {
  id: string;
  kpi_id: string;
  reading_date: string;
  value: number;
  performance_analysis: string | null;
  created_at: string;
}

export interface KpiActionPlan {
  id: string;
  kpi_id: string;
  description: string;
  owner: string | null;
  due_date: string | null;
  status: string;
  created_at: string;
}

export interface Kpi {
  id: string;
  name: string;
  description: string | null;
  pillar: string | null;
  entity: string | null;
  unit: string | null;
  polarity: string;
  decimal_places: number;
  data_source: string | null;
  calculation_method: string | null;
  frequency: string;
  rationale: string | null;
  baseline: number | null;
  target: number | null;
  is_priority: boolean;
  tier_id: string | null;
  objective_id: string | null;
  owner_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface KpiListItem extends Kpi {
  tier: { name: string } | null;
  objective: { name: string } | null;
  owner: { full_name: string | null; email: string | null } | null;
  readings: KpiReading[];
  action_plans: KpiActionPlan[];
}

const COLUMNS =
  'id, name, description, pillar, entity, unit, polarity, decimal_places, data_source, calculation_method, frequency, rationale, baseline, target, is_priority, tier_id, objective_id, owner_id, created_at, updated_at';

const JOINS = `${COLUMNS},
  tier:tiers ( name ),
  objective:strategic_objectives ( name ),
  owner:profiles!owner_id ( full_name, email ),
  readings:kpi_readings ( id, kpi_id, reading_date, value, performance_analysis, created_at ),
  action_plans:kpi_action_plans ( id, kpi_id, description, owner, due_date, status, created_at )`;

@Injectable()
export class KpisRepository {
  constructor(private readonly db: DatabaseService) {}

  private get table() {
    return this.db.client.from('kpis');
  }

  async findAll(): Promise<KpiListItem[]> {
    const { data, error } = await this.table
      .select(JOINS)
      .order('name', { ascending: true });
    if (error) throw toHttpException(error, 'kpis.findAll');
    return (data ?? []) as unknown as KpiListItem[];
  }

  async findOne(kpiId: string): Promise<KpiListItem | null> {
    const { data, error } = await this.table
      .select(JOINS)
      .eq('id', kpiId)
      .maybeSingle();
    if (error) throw toHttpException(error, 'kpis.findOne');
    return (data as unknown as KpiListItem) ?? null;
  }

  async insert(row: Record<string, unknown>): Promise<KpiListItem> {
    const { data, error } = await this.table.insert(row).select(JOINS).single();
    if (error) throw toHttpException(error, 'kpis.insert');
    return data as unknown as KpiListItem;
  }

  async update(
    kpiId: string,
    patch: Record<string, unknown>,
  ): Promise<KpiListItem | null> {
    const { data, error } = await this.table
      .update(patch)
      .eq('id', kpiId)
      .select(JOINS)
      .maybeSingle();
    if (error) throw toHttpException(error, 'kpis.update');
    return (data as unknown as KpiListItem) ?? null;
  }

  async remove(kpiId: string): Promise<{ id: string } | null> {
    const { data, error } = await this.table
      .delete()
      .eq('id', kpiId)
      .select('id')
      .maybeSingle<{ id: string }>();
    if (error) throw toHttpException(error, 'kpis.remove');
    return data ?? null;
  }

  async insertReading(row: Record<string, unknown>): Promise<KpiReading> {
    const { data, error } = await this.db.client
      .from('kpi_readings')
      .insert(row)
      .select(
        'id, kpi_id, reading_date, value, performance_analysis, created_at',
      )
      .single<KpiReading>();
    if (error) throw toHttpException(error, 'kpis.insertReading');
    return data;
  }

  async removeReading(kpiId: string, readingId: string): Promise<void> {
    const { error } = await this.db.client
      .from('kpi_readings')
      .delete()
      .eq('kpi_id', kpiId)
      .eq('id', readingId);
    if (error) throw toHttpException(error, 'kpis.removeReading');
  }

  async insertPlan(row: Record<string, unknown>): Promise<KpiActionPlan> {
    const { data, error } = await this.db.client
      .from('kpi_action_plans')
      .insert(row)
      .select('id, kpi_id, description, owner, due_date, status, created_at')
      .single<KpiActionPlan>();
    if (error) throw toHttpException(error, 'kpis.insertPlan');
    return data;
  }

  async updatePlan(
    kpiId: string,
    planId: string,
    patch: Record<string, unknown>,
  ): Promise<void> {
    const { error } = await this.db.client
      .from('kpi_action_plans')
      .update(patch)
      .eq('kpi_id', kpiId)
      .eq('id', planId);
    if (error) throw toHttpException(error, 'kpis.updatePlan');
  }

  async removePlan(kpiId: string, planId: string): Promise<void> {
    const { error } = await this.db.client
      .from('kpi_action_plans')
      .delete()
      .eq('kpi_id', kpiId)
      .eq('id', planId);
    if (error) throw toHttpException(error, 'kpis.removePlan');
  }
}
