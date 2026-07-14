import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { toHttpException } from '../../common/supabase-error';

export interface Link {
  id: string;
  project_id: string;
  label: string | null;
  url: string;
  description: string | null;
  is_gold: boolean;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface LinkListItem extends Link {
  created_by_profile?: {
    full_name: string | null;
    email: string | null;
  } | null;
}

const COLUMNS =
  'id, project_id, label, url, description, is_gold, tags, created_at, updated_at';

@Injectable()
export class LinksRepository {
  constructor(private readonly db: DatabaseService) {}

  private get table() {
    return this.db.client.from('links');
  }

  async insert(row: Record<string, unknown>): Promise<Link> {
    const { data, error } = await this.table
      .insert(row)
      .select(COLUMNS)
      .single();
    if (error) throw toHttpException(error, 'links.insert');
    return data;
  }

  async update(
    projectId: string,
    linkId: string,
    patch: Record<string, unknown>,
  ): Promise<LinkListItem> {
    const { data, error } = await this.table
      .update(patch)
      .eq('project_id', projectId)
      .eq('id', linkId)
      .select(
        `${COLUMNS},
         created_by_profile:profiles!created_by ( full_name, email )`,
      )
      .single();
    if (error) throw toHttpException(error, 'links.update');
    return data as unknown as LinkListItem;
  }

  /** Returns the deleted id, or null when the link is not in this project. */
  async remove(projectId: string, linkId: string): Promise<string | null> {
    const { data, error } = await this.table
      .delete()
      .eq('project_id', projectId)
      .eq('id', linkId)
      .select('id')
      .maybeSingle<{ id: string }>();
    if (error) throw toHttpException(error, 'links.remove');
    return data?.id ?? null;
  }

  async findByProject(projectId: string): Promise<LinkListItem[]> {
    const { data, error } = await this.table
      .select(
        `${COLUMNS},
         created_by_profile:profiles!created_by ( full_name, email )`,
      )
      .eq('project_id', projectId)
      .order('is_gold', { ascending: false })
      .order('created_at', { ascending: false });
    if (error) throw toHttpException(error, 'links.findByProject');
    return (data ?? []) as unknown as LinkListItem[];
  }
}
