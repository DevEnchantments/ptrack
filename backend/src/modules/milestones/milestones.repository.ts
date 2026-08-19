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
  /** Set once at creation; due_date may slip, this records where it started. */
  original_due_date: string | null;
  status: string;
  role_id: string | null;
  owner_id: string | null;
  is_major: boolean;
  tags: string[] | null;
  weightage: number | null;
  percent_complete: number | null;
  completed_date: string | null;
  /** FDD Fig 2 outcome grouping (docs/FDD-ALIGNMENT.md section 1.2). */
  outcome_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface MilestoneListItem extends Milestone {
  role: { name: string } | null;
  owner: { full_name: string | null; email: string | null } | null;
  outcome?: { id: string; name: string; sort_order: number | null } | null;
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
  'id, project_id, name, description, start_date, due_date, original_due_date, status, role_id, owner_id, is_major, tags, weightage, percent_complete, completed_date, outcome_id, created_at, updated_at';

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

  /**
   * Atomic weight replacement via db/adjust_milestone_weights.sql — a partial
   * failure of N independent updates could break the weights-total-100 rule.
   */
  async adjustWeights(
    projectId: string,
    ids: string[],
    weights: Array<number | null>,
    userId: string,
  ): Promise<void> {
    const { error } = await this.db.client.rpc('adjust_milestone_weights', {
      p_project_id: projectId,
      p_ids: ids,
      p_weights: weights,
      p_user_id: userId,
    });
    if (error) throw toHttpException(error, 'milestones.adjustWeights');
  }

  /**
   * Null when no row matched. `maybeSingle`, not `single`: `single` turns "no
   * rows" into PGRST116, which falls through toHttpException's default branch
   * as a 500. The service pre-checks, so that only bites when the row is
   * deleted between the check and this write — a narrow race, but the whole
   * point of the invariant is that no path can 500 on a missing row.
   */
  async update(
    projectId: string,
    milestoneId: string,
    patch: Record<string, unknown>,
  ): Promise<Milestone | null> {
    const { data, error } = await this.table
      .update(patch)
      .eq('project_id', projectId)
      .eq('id', milestoneId)
      .select(COLUMNS)
      .maybeSingle<Milestone>();
    if (error) throw toHttpException(error, 'milestones.update');
    return data ?? null;
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

  /** Wholesale-replace the predecessor set of one milestone. */
  async replaceDependencies(
    projectId: string,
    milestoneId: string,
    sourceIds: string[],
  ): Promise<void> {
    const del = await this.db.client
      .from('milestone_dependencies')
      .delete()
      .eq('target_id', milestoneId);
    if (del.error) throw toHttpException(del.error, 'milestones.deps');
    const clean = [...new Set(sourceIds)].filter((id) => id !== milestoneId);
    if (clean.length === 0) return;
    const ins = await this.db.client.from('milestone_dependencies').insert(
      clean.map((sourceId) => ({
        project_id: projectId,
        source_id: sourceId,
        target_id: milestoneId,
      })),
    );
    if (ins.error) throw toHttpException(ins.error, 'milestones.deps');
  }

  async findByProject(projectId: string): Promise<MilestoneListItem[]> {
    const { data, error } = await this.table
      .select(
        `${COLUMNS},
         role:project_roles ( name ),
         owner:profiles!owner_id ( full_name, email ),
         outcome:program_outcomes ( id, name, sort_order ),
         depends_on:milestone_dependencies!target_id ( source_id )`,
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
         outcome:program_outcomes ( id, name, sort_order ),
         depends_on:milestone_dependencies!target_id ( source_id ),
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
