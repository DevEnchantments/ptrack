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

  /** Returns the deleted id, or null when the update is not in this project. */
  async remove(projectId: string, updateId: string): Promise<string | null> {
    const { data, error } = await this.table
      .delete()
      .eq('project_id', projectId)
      .eq('id', updateId)
      .select('id')
      .maybeSingle<{ id: string }>();
    if (error) throw toHttpException(error, 'updates.remove');
    return data?.id ?? null;
  }

  async findByProject(projectId: string): Promise<UpdateListItem[]> {
    const { data, error } = await this.table
      .select(JOINS)
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });
    if (error) throw toHttpException(error, 'updates.findByProject');
    return (data ?? []) as unknown as UpdateListItem[];
  }
}
