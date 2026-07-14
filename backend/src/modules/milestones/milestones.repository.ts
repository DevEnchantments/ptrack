import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { toHttpException } from '../../common/supabase-error';
import { HISTORY_SELECT, type HistoryEntry } from '../../common/record-history';

export interface Milestone {
  id: string;
  project_id: string;
  name: string;
  description: string | null;
  start_date: string | null;
  due_date: string | null;
  status: string;
  role_id: string | null;
  owner_id: string | null;
  is_major: boolean;
  tags: string[] | null;
  weightage: number | null;
  percent_complete: number | null;
  completed_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface MilestoneListItem extends Milestone {
  role: { name: string } | null;
  owner: { full_name: string | null; email: string | null } | null;
  project?: { name: string } | null;
  created_by_profile?: {
    full_name: string | null;
    email: string | null;
  } | null;
  updated_by_profile?: {
    full_name: string | null;
    email: string | null;
  } | null;
}

const COLUMNS =
  'id, project_id, name, description, start_date, due_date, status, role_id, owner_id, is_major, tags, weightage, percent_complete, completed_date, created_at, updated_at';

@Injectable()
export class MilestonesRepository {
  constructor(private readonly db: DatabaseService) {}

  private get table() {
    return this.db.client.from('milestones');
  }

  async insert(row: Record<string, unknown>): Promise<Milestone> {
    const { data, error } = await this.table
      .insert(row)
      .select(COLUMNS)
      .single();
    if (error) throw toHttpException(error, 'milestones.insert');
    return data;
  }

  async update(
    projectId: string,
    milestoneId: string,
    patch: Record<string, unknown>,
  ): Promise<Milestone> {
    const { data, error } = await this.table
      .update(patch)
      .eq('project_id', projectId)
      .eq('id', milestoneId)
      .select(COLUMNS)
      .single();
    if (error) throw toHttpException(error, 'milestones.update');
    return data;
  }

  async findHistory(
    projectId: string,
    milestoneId: string,
  ): Promise<HistoryEntry[]> {
    const { data, error } = await this.db.client
      .from('record_history')
      .select(HISTORY_SELECT)
      .eq('table_name', 'milestones')
      .eq('project_id', projectId)
      .eq('record_id', milestoneId)
      .order('changed_at', { ascending: false });
    if (error) throw toHttpException(error, 'milestones.findHistory');
    return (data ?? []) as unknown as HistoryEntry[];
  }

  async remove(projectId: string, milestoneId: string): Promise<void> {
    const { error } = await this.table
      .delete()
      .eq('project_id', projectId)
      .eq('id', milestoneId);
    if (error) throw toHttpException(error, 'milestones.remove');
  }

  async findByProject(projectId: string): Promise<MilestoneListItem[]> {
    const { data, error } = await this.table
      .select(
        `${COLUMNS},
         role:project_roles ( name ),
         owner:profiles!owner_id ( full_name, email )`,
      )
      .eq('project_id', projectId)
      .order('due_date', { ascending: true });
    if (error) throw toHttpException(error, 'milestones.findByProject');
    return (data ?? []) as unknown as MilestoneListItem[];
  }

  async findOne(
    projectId: string,
    milestoneId: string,
  ): Promise<MilestoneListItem | null> {
    const { data, error } = await this.table
      .select(
        `${COLUMNS},
         role:project_roles ( name ),
         owner:profiles!owner_id ( full_name, email ),
         project:projects ( name ),
         created_by_profile:profiles!created_by ( full_name, email ),
         updated_by_profile:profiles!updated_by ( full_name, email )`,
      )
      .eq('project_id', projectId)
      .eq('id', milestoneId)
      .maybeSingle();
    if (error) throw toHttpException(error, 'milestones.findOne');
    return (data as unknown as MilestoneListItem) ?? null;
  }
}
