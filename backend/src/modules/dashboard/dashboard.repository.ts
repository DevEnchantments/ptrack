import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { toHttpException } from '../../common/supabase-error';

export interface DashboardProjectRow {
  id: string;
  created_at: string;
  start_date: string | null;
  target_end_date: string | null;
  approved_budget: number | null;
  utilized_budget: number | null;
  status: { name: string } | null;
  category: { name: string } | null;
}

export interface DashboardMilestoneRow {
  project_id: string;
  status: string;
  due_date: string | null;
  completed_date: string | null;
  is_major: boolean;
  weightage: number | null;
  percent_complete: number | null;
}

export interface DashboardActionItemRow {
  project_id: string;
  status: string;
  due_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface DashboardSubmissionRow {
  project_id: string;
  status: string;
}

/** Everything the dashboard reads, in one round of concurrent queries. */
export interface DashboardSource {
  projects: DashboardProjectRow[];
  milestones: DashboardMilestoneRow[];
  actionItems: DashboardActionItemRow[];
  updates: Array<{ created_at: string }>;
  history: Array<{ changed_at: string }>;
  submissions: DashboardSubmissionRow[];
}

/**
 * The dashboard's reads, extracted from the service (REFACTOR-PLAN v2,
 * Phase 0) so the aggregation above them can be tested at all.
 *
 * One method rather than six: the dashboard always needs the whole set, the
 * queries must run concurrently, and the two date bounds are the only thing the
 * caller varies. Six separate methods would push that orchestration back up
 * into the service for no gain.
 */
@Injectable()
export class DashboardRepository {
  constructor(private readonly db: DatabaseService) {}

  async load(bounds: {
    /** Oldest `changed_at` the activity heatmap displays. */
    historyFrom: string;
    /** Today, as yyyy-mm-dd: picks the cycle that is currently open. */
    today: string;
  }): Promise<DashboardSource> {
    const [projects, milestones, actionItems, updates, history, submissions] =
      await Promise.all([
        this.db.client
          .from('projects')
          .select(
            'id, created_at, start_date, target_end_date, approved_budget, utilized_budget, status:project_statuses ( name ), category:project_categories ( name )',
          ),
        this.db.client
          .from('milestones')
          .select(
            'project_id, status, due_date, completed_date, is_major, weightage, percent_complete',
          ),
        this.db.client
          .from('action_items')
          .select('project_id, status, due_date, created_at, updated_at'),
        this.db.client.from('updates').select('created_at'),
        this.db.client
          .from('record_history')
          .select('changed_at')
          .gte('changed_at', bounds.historyFrom),
        this.db.client
          .from('submissions')
          .select(
            'project_id, status, cycles!inner ( period_start, period_end )',
          )
          .lte('cycles.period_start', bounds.today)
          .gte('cycles.period_end', bounds.today),
      ]);

    for (const result of [
      projects,
      milestones,
      actionItems,
      updates,
      history,
      submissions,
    ]) {
      if (result.error) throw toHttpException(result.error, 'dashboard.data');
    }

    return {
      projects: (projects.data ?? []) as unknown as DashboardProjectRow[],
      milestones: (milestones.data ?? []) as unknown as DashboardMilestoneRow[],
      actionItems: (actionItems.data ??
        []) as unknown as DashboardActionItemRow[],
      updates: (updates.data ?? []) as unknown as Array<{ created_at: string }>,
      history: (history.data ?? []) as unknown as Array<{ changed_at: string }>,
      submissions: (submissions.data ??
        []) as unknown as DashboardSubmissionRow[],
    };
  }
}
