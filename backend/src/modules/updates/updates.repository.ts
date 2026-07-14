import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { toHttpException } from '../../common/supabase-error';

export interface Update {
  id: string;
  project_id: string;
  headline: string | null;
  body: string | null;
  type_id: string | null;
  is_gold: boolean;
  tags: string[] | null;
  author_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface UpdateListItem extends Update {
  type: { name: string } | null;
  author: { full_name: string | null; email: string | null } | null;
}

const COLUMNS =
  'id, project_id, headline, body, type_id, is_gold, tags, author_id, created_at, updated_at';

const JOINS = `${COLUMNS},
  type:update_types ( name ),
  author:profiles!author_id ( full_name, email )`;

@Injectable()
export class UpdatesRepository {
  constructor(private readonly db: DatabaseService) {}

  private get table() {
    return this.db.client.from('updates');
  }

  async insert(row: Record<string, unknown>): Promise<UpdateListItem> {
    const { data, error } = await this.table.insert(row).select(JOINS).single();
    if (error) throw toHttpException(error, 'updates.insert');
    return data as unknown as UpdateListItem;
  }

  async update(
    projectId: string,
    updateId: string,
    patch: Record<string, unknown>,
  ): Promise<UpdateListItem> {
    const { data, error } = await this.table
      .update(patch)
      .eq('project_id', projectId)
      .eq('id', updateId)
      .select(JOINS)
      .single();
    if (error) throw toHttpException(error, 'updates.update');
    return data as unknown as UpdateListItem;
  }

  /** Returns the deleted row's id+label, or null when not in this project. */
  async remove(
    projectId: string,
    updateId: string,
  ): Promise<{ id: string; label: string | null } | null> {
    const { data, error } = await this.table
      .delete()
      .eq('project_id', projectId)
      .eq('id', updateId)
      .select('id, body')
      .maybeSingle<{ id: string; body: string | null }>();
    if (error) throw toHttpException(error, 'updates.remove');
    // Updates have no title; use a snippet of the body as the audit label.
    const snippet = data?.body
      ? data.body.length > 80
        ? `${data.body.slice(0, 77)}…`
        : data.body
      : null;
    return data ? { id: data.id, label: snippet } : null;
  }

  async findByProject(
    projectId: string,
    page?: { limit?: number; offset?: number },
  ): Promise<UpdateListItem[]> {
    let query = this.table
      .select(JOINS)
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });
    if (page?.limit) {
      const from = page.offset ?? 0;
      query = query.range(from, from + page.limit - 1);
    }
    const { data, error } = await query;
    if (error) throw toHttpException(error, 'updates.findByProject');
    return (data ?? []) as unknown as UpdateListItem[];
  }
}
