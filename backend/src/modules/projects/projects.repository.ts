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
  deal_type_id: string | null;
  region_id: string | null;
  country_id: string | null;
  start_date: string | null;
  target_end_date: string | null;
  actual_end_date: string | null;
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
}

const COLUMNS =
  'id, name, description, parent_project_id, owner_id, sponsor, status_id, size_id, deal_type_id, region_id, country_id, start_date, target_end_date, actual_end_date, created_by, updated_by, created_at, updated_at';

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

  async findById(id: string): Promise<Project | null> {
    const { data, error } = await this.table
      .select(COLUMNS)
      .eq('id', id)
      .maybeSingle();
    if (error) throw toHttpException(error, 'projects.findById');
    return (data as unknown as Project) ?? null;
  }
}