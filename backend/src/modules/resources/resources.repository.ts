import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { toHttpException } from '../../common/supabase-error';

export interface Resource {
  id: string;
  project_id: string;
  name: string;
  type_id: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface ResourceListItem extends Resource {
  type: { name: string } | null;
  updated_by_profile?: {
    full_name: string | null;
    email: string | null;
  } | null;
}

const COLUMNS =
  'id, project_id, name, type_id, description, created_at, updated_at';

@Injectable()
export class ResourcesRepository {
  constructor(private readonly db: DatabaseService) {}

  private get table() {
    return this.db.client.from('resources');
  }

  async insert(row: Record<string, unknown>): Promise<Resource> {
    const { data, error } = await this.table
      .insert(row)
      .select(COLUMNS)
      .single();
    if (error) throw toHttpException(error, 'resources.insert');
    return data as unknown as Resource;
  }

  async update(
    projectId: string,
    resourceId: string,
    patch: Record<string, unknown>,
  ): Promise<Resource> {
    const { data, error } = await this.table
      .update(patch)
      .eq('project_id', projectId)
      .eq('id', resourceId)
      .select(COLUMNS)
      .single();
    if (error) throw toHttpException(error, 'resources.update');
    return data as unknown as Resource;
  }

  async findByProject(projectId: string): Promise<ResourceListItem[]> {
    const { data, error } = await this.table
      .select(
        `${COLUMNS},
         type:resource_types ( name ),
         updated_by_profile:profiles!updated_by ( full_name, email )`,
      )
      .eq('project_id', projectId)
      .order('updated_at', { ascending: false });
    if (error) throw toHttpException(error, 'resources.findByProject');
    return (data ?? []) as unknown as ResourceListItem[];
  }
}