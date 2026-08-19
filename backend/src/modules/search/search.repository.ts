import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { toHttpException } from '../../common/supabase-error';

export interface NamedRow {
  id: string;
  name: string;
}

export interface ChildRow {
  id: string;
  label: string;
  project_id: string;
  project: { name: string } | null;
}

export interface SavedSearch {
  id: string;
  name: string;
  query: string;
  created_at: string;
}

/**
 * Search reads.
 *
 * The caller passes a ready-made ilike pattern: deciding what counts as a
 * searchable query, and escaping it, stays in the service where it is testable
 * (REFACTOR-PLAN v2, Phase 0 — seam first).
 */
@Injectable()
export class SearchRepository {
  constructor(private readonly db: DatabaseService) {}

  /** Projects match on more than their name, hence the or-filter. */
  async searchProjects(pattern: string, limit: number): Promise<NamedRow[]> {
    const { data, error } = await this.db.client
      .from('projects')
      .select('id, name')
      .or(
        `name.ilike.${pattern},description.ilike.${pattern},project_number.ilike.${pattern},reference_id.ilike.${pattern}`,
      )
      .limit(limit);
    if (error) throw toHttpException(error, 'search.projects');
    return data ?? [];
  }

  /** Any project-scoped table with a single searchable label column. */
  async searchChildren(
    table: string,
    labelColumn: string,
    pattern: string,
    limit: number,
  ): Promise<ChildRow[]> {
    const { data, error } = await this.db.client
      .from(table)
      .select(`id, label:${labelColumn}, project_id, project:projects ( name )`)
      .ilike(labelColumn, pattern)
      .limit(limit);
    if (error) throw toHttpException(error, `search.${table}`);
    return (data ?? []) as unknown as ChildRow[];
  }

  async searchKpis(pattern: string, limit: number): Promise<NamedRow[]> {
    const { data, error } = await this.db.client
      .from('kpis')
      .select('id, name')
      .ilike('name', pattern)
      .limit(limit);
    if (error) throw toHttpException(error, 'search.kpis');
    return data ?? [];
  }

  async listSaved(userId: string): Promise<SavedSearch[]> {
    const { data, error } = await this.db.client
      .from('saved_searches')
      .select('id, name, query, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw toHttpException(error, 'search.saved.list');
    return data ?? [];
  }

  async insertSaved(
    userId: string,
    name: string,
    query: string,
  ): Promise<SavedSearch> {
    const { data, error } = await this.db.client
      .from('saved_searches')
      .insert({ user_id: userId, name, query })
      .select('id, name, query, created_at')
      .single<SavedSearch>();
    if (error) throw toHttpException(error, 'search.saved.add');
    return data;
  }

  /** Null when the saved search is not this user's, so the caller can 404. */
  async deleteSaved(
    userId: string,
    savedSearchId: string,
  ): Promise<{ id: string } | null> {
    const { data, error } = await this.db.client
      .from('saved_searches')
      .delete()
      .eq('user_id', userId)
      .eq('id', savedSearchId)
      .select('id')
      .maybeSingle<{ id: string }>();
    if (error) throw toHttpException(error, 'search.saved.remove');
    return data ?? null;
  }
}
