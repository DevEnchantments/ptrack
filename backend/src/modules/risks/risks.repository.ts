import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { toHttpException } from '../../common/supabase-error';

export interface Risk {
  id: string;
  project_id: string;
  statement: string;
  identified_by: string | null;
  date_identified: string | null;
  source_id: string | null;
  category_id: string | null;
  owner_id: string | null;
  probability_id: string | null;
  impact_id: string | null;
  response_id: string | null;
  response_plan: string | null;
  priority: string | null;
  action: string | null;
  status: string;
  /** FDD register RISK/ISSUE toggle. */
  type: string;
  created_at: string;
  updated_at: string;
}

export interface RiskListItem extends Risk {
  source: { name: string } | null;
  category: { name: string } | null;
  probability: { name: string; sort_order: number | null } | null;
  impact: { name: string; sort_order: number | null } | null;
  response: { name: string } | null;
  owner: { full_name: string | null; email: string | null } | null;
  updated_by_profile?: {
    full_name: string | null;
    email: string | null;
  } | null;
}

const COLUMNS =
  'id, project_id, statement, identified_by, date_identified, source_id, category_id, owner_id, probability_id, impact_id, response_id, response_plan, priority, action, status, type, created_at, updated_at';

const JOINS = `${COLUMNS},
  source:risk_sources ( name ),
  category:risk_categories ( name ),
  probability:risk_probability_levels ( name, sort_order ),
  impact:risk_impact_levels ( name, sort_order ),
  response:risk_responses ( name ),
  owner:profiles!owner_id ( full_name, email ),
  updated_by_profile:profiles!updated_by ( full_name, email )`;

@Injectable()
export class RisksRepository {
  constructor(private readonly db: DatabaseService) {}

  private get table() {
    return this.db.client.from('risks');
  }

  async insert(row: Record<string, unknown>): Promise<RiskListItem> {
    const { data, error } = await this.table.insert(row).select(JOINS).single();
    if (error) throw toHttpException(error, 'risks.insert');
    return data as unknown as RiskListItem;
  }

  async update(
    projectId: string,
    riskId: string,
    patch: Record<string, unknown>,
  ): Promise<RiskListItem> {
    const { data, error } = await this.table
      .update(patch)
      .eq('project_id', projectId)
      .eq('id', riskId)
      .select(JOINS)
      .single();
    if (error) throw toHttpException(error, 'risks.update');
    return data as unknown as RiskListItem;
  }

  /** Returns the deleted row's id+label, or null when not in this project. */
  async remove(
    projectId: string,
    riskId: string,
  ): Promise<{ id: string; label: string | null } | null> {
    const { data, error } = await this.table
      .delete()
      .eq('project_id', projectId)
      .eq('id', riskId)
      .select('id, statement')
      .maybeSingle<{ id: string; statement: string | null }>();
    if (error) throw toHttpException(error, 'risks.remove');
    return data ? { id: data.id, label: data.statement } : null;
  }

  async findByProject(projectId: string): Promise<RiskListItem[]> {
    const { data, error } = await this.table
      .select(JOINS)
      .eq('project_id', projectId)
      .order('updated_at', { ascending: false });
    if (error) throw toHttpException(error, 'risks.findByProject');
    return (data ?? []) as unknown as RiskListItem[];
  }
}
