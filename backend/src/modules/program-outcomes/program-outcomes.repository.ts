import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { toHttpException } from '../../common/supabase-error';

export interface ProgramOutcome {
  id: string;
  project_id: string;
  name: string;
  /** Fig 2's outcome numbering; auto-assigned when omitted on create. */
  sort_order: number | null;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  updated_at: string;
}

const COLUMNS =
  'id, project_id, name, sort_order, start_date, end_date, created_at, updated_at';

@Injectable()
export class ProgramOutcomesRepository {
  constructor(private readonly db: DatabaseService) {}

  private get table() {
    return this.db.client.from('program_outcomes');
  }

  async findByProject(projectId: string): Promise<ProgramOutcome[]> {
    const { data, error } = await this.table
      .select(COLUMNS)
      .eq('project_id', projectId)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true });
    if (error) throw toHttpException(error, 'programOutcomes.findByProject');
    return data ?? [];
  }

  async insert(row: Record<string, unknown>): Promise<ProgramOutcome> {
    const { data, error } = await this.table
      .insert(row)
      .select(COLUMNS)
      .single();
    if (error) throw toHttpException(error, 'programOutcomes.insert');
    return data;
  }

  async update(
    projectId: string,
    outcomeId: string,
    patch: Record<string, unknown>,
  ): Promise<ProgramOutcome | null> {
    const { data, error } = await this.table
      .update(patch)
      .eq('project_id', projectId)
      .eq('id', outcomeId)
      .select(COLUMNS)
      .maybeSingle<ProgramOutcome>();
    if (error) throw toHttpException(error, 'programOutcomes.update');
    return data ?? null;
  }

  /** Returns the deleted row's id+label, or null when not in this project. */
  async remove(
    projectId: string,
    outcomeId: string,
  ): Promise<{ id: string; label: string | null } | null> {
    const { data, error } = await this.table
      .delete()
      .eq('project_id', projectId)
      .eq('id', outcomeId)
      .select('id, name')
      .maybeSingle<{ id: string; name: string | null }>();
    if (error) throw toHttpException(error, 'programOutcomes.remove');
    return data ? { id: data.id, label: data.name } : null;
  }
}
