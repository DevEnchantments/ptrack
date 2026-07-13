import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { toHttpException } from '../../common/supabase-error';

export interface Project {
  id: string;
  name: string;
  description: string | null;
  parent_project_id: string | null;
  owner_id: string | null;
  sponsor: string | null;
  status_id: string | null;
  size_id: string | null;
  category_id: string | null;
  deal_type_id: string | null;
  region_id: string | null;
  country_id: string | null;
  access_control: string;
  goal: string | null;
  customer: string | null;
  tags: string[] | null;
  primary_url: string | null;
  start_date: string | null;
  target_end_date: string | null;
  actual_end_date: string | null;
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProjectDetail extends Project {
  status: { name: string } | null;
  size: { name: string } | null;
  category: { name: string } | null;
  members: Array<{
    id: string;
    user_id: string | null;
    pending_name: string | null;
    role_id: string | null;
    access_level: string;
    involvement_level_id: string | null;
    notes: string | null;
    status: string;
    role: { name: string } | null;
    profile: { full_name: string | null; email: string | null } | null;
  }>;
}

const COLUMNS =
  'id, name, description, parent_project_id, owner_id, sponsor, status_id, size_id, category_id, deal_type_id, region_id, country_id, access_control, goal, customer, tags, primary_url, start_date, target_end_date, actual_end_date, created_by, updated_by, created_at, updated_at';

@Injectable()
export class ProjectsRepository {
  constructor(private readonly db: DatabaseService) {}

  private get table() {
    return this.db.client.from('projects');
  }

  async insert(row: Partial<Project>): Promise<Project> {
    const { data, error } = await this.table
      .insert(row)
      .select(COLUMNS)
      .single();
    if (error) throw toHttpException(error, 'projects.insert');
    return data as unknown as Project;
  }

  async findAll(): Promise<Project[]> {
    const { data, error } = await this.table
      .select(COLUMNS)
      .order('created_at', { ascending: false });
    if (error) throw toHttpException(error, 'projects.findAll');
    return (data ?? []) as unknown as Project[];
  }

  async findDetail(id: string): Promise<ProjectDetail | null> {
    const { data, error } = await this.table
      .select(
        `
        ${COLUMNS},
        status:project_statuses ( name ),
        size:project_sizes ( name ),
        category:project_categories ( name ),
        members:project_members (
          id, user_id, pending_name, role_id, access_level,
          involvement_level_id, notes, status,
          role:project_roles ( name ),
          profile:profiles!user_id ( full_name, email )
        )
      `,
      )
      .eq('id', id)
      .maybeSingle();
    if (error) throw toHttpException(error, 'projects.findDetail');
    return (data as unknown as ProjectDetail) ?? null;
  }

  async insertMembers(rows: Record<string, unknown>[]): Promise<void> {
    const { error } = await this.db.client.from('project_members').insert(rows);
    if (error) throw toHttpException(error, 'projectMembers.insert');
  }

  async update(id: string, patch: Record<string, unknown>): Promise<void> {
    const { error } = await this.table.update(patch).eq('id', id);
    if (error) throw toHttpException(error, 'projects.update');
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.table.delete().eq('id', id);
    if (error) throw toHttpException(error, 'projects.delete');
  }
}