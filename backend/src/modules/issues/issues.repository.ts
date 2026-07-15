import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { toHttpException } from '../../common/supabase-error';

export interface Issue {
  id: string;
  project_id: string;
  title: string;
  description: string | null;
  category_id: string | null;
  level_id: string | null;
  role_id: string | null;
  owner_id: string | null;
  status: string;
  url: string | null;
  /** External ticket / tracking number (free text, demo's "Reference Identifier"). */
  reference_identifier: string | null;
  tags: string[] | null;
  resolution: string | null;
  created_at: string;
  updated_at: string;
}

export interface IssueListItem extends Issue {
  category: { name: string } | null;
  level: { name: string } | null;
  role: { name: string } | null;
  owner: { full_name: string | null; email: string | null } | null;
  updated_by_profile?: {
    full_name: string | null;
    email: string | null;
  } | null;
}

const COLUMNS =
  'id, project_id, title, description, category_id, level_id, role_id, owner_id, status, url, reference_identifier, tags, resolution, created_at, updated_at';

const JOINS = `${COLUMNS},
  category:issue_categories ( name ),
  level:issue_levels ( name ),
  role:project_roles ( name ),
  owner:profiles!owner_id ( full_name, email ),
  updated_by_profile:profiles!updated_by ( full_name, email )`;

@Injectable()
export class IssuesRepository {
  constructor(private readonly db: DatabaseService) {}

  private get table() {
    return this.db.client.from('issues');
  }

  async insert(row: Record<string, unknown>): Promise<IssueListItem> {
    const { data, error } = await this.table.insert(row).select(JOINS).single();
    if (error) throw toHttpException(error, 'issues.insert');
    return data as unknown as IssueListItem;
  }

  async update(
    projectId: string,
    issueId: string,
    patch: Record<string, unknown>,
  ): Promise<IssueListItem> {
    const { data, error } = await this.table
      .update(patch)
      .eq('project_id', projectId)
      .eq('id', issueId)
      .select(JOINS)
      .single();
    if (error) throw toHttpException(error, 'issues.update');
    return data as unknown as IssueListItem;
  }

  /** Returns the deleted row's id+label, or null when not in this project. */
  async remove(
    projectId: string,
    issueId: string,
  ): Promise<{ id: string; label: string | null } | null> {
    const { data, error } = await this.table
      .delete()
      .eq('project_id', projectId)
      .eq('id', issueId)
      .select('id, title')
      .maybeSingle<{ id: string; title: string | null }>();
    if (error) throw toHttpException(error, 'issues.remove');
    return data ? { id: data.id, label: data.title } : null;
  }

  async findByProject(projectId: string): Promise<IssueListItem[]> {
    const { data, error } = await this.table
      .select(JOINS)
      .eq('project_id', projectId)
      .order('updated_at', { ascending: false });
    if (error) throw toHttpException(error, 'issues.findByProject');
    return (data ?? []) as unknown as IssueListItem[];
  }
}
