import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { toHttpException } from '../../common/supabase-error';

export interface ChartPoint {
  label: string;
  value: number;
}

export interface DashboardData {
  stats: {
    active_projects: number;
    projects_created_this_month: number;
    open_action_items: number;
    action_items_due_this_week: number;
    milestones_this_month: number;
    major_milestones_this_month: number;
    overdue_items: number;
  };
  updates_per_week: ChartPoint[];
  projects_by_status: ChartPoint[];
  action_items: { open: number; closed: number; overdue: number };
  projects_by_category: ChartPoint[];
  milestones_per_month: ChartPoint[];
  flow: { labels: string[]; created: number[]; completed: number[] };
  overall_milestones: { done: number; total: number };
  /** 12 weeks x Mon-Fri raw activity counts (record_history rows). */
  heat: number[][];
}

const DONE = 'closed_completed';
const NA = 'not_applicable';
const CLOSED_PROJECT = new Set([
  'completed',
  'complete',
  'cancelled',
  'closed',
]);

function iso(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** Monday of the week containing `d` (UTC). */
function weekStart(d: Date): Date {
  const copy = new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()),
  );
  const day = copy.getUTCDay();
  copy.setUTCDate(copy.getUTCDate() - ((day + 6) % 7));
  return copy;
}

@Injectable()
export class DashboardService {
  constructor(private readonly db: DatabaseService) {}

  /** Live aggregates for My Dashboard — shapes mirror the chart components. */
  async data(): Promise<DashboardData> {
    const now = new Date();
    const today = iso(now);
    const thisWeek = weekStart(now);
    const heatFrom = new Date(thisWeek);
    heatFrom.setUTCDate(heatFrom.getUTCDate() - 7 * 11);

    const [projects, milestones, actionItems, updates, history] =
      await Promise.all([
        this.db.client
          .from('projects')
          .select(
            'id, created_at, status:project_statuses ( name ), category:project_categories ( name )',
          ),
        this.db.client
          .from('milestones')
          .select('status, due_date, completed_date, is_major'),
        this.db.client
          .from('action_items')
          .select('status, due_date, created_at, updated_at'),
        this.db.client.from('updates').select('created_at'),
        this.db.client
          .from('record_history')
          .select('changed_at')
          .gte('changed_at', heatFrom.toISOString()),
      ]);
    for (const r of [projects, milestones, actionItems, updates, history]) {
      if (r.error) throw toHttpException(r.error, 'dashboard.data');
    }

    type ProjectRow = {
      id: string;
      created_at: string;
      status: { name: string } | null;
      category: { name: string } | null;
    };
    type MilestoneRow = {
      status: string;
      due_date: string | null;
      completed_date: string | null;
      is_major: boolean;
    };
    type ActionItemRow = {
      status: string;
      due_date: string | null;
      created_at: string;
      updated_at: string;
    };
    const projectRows = (projects.data ?? []) as unknown as ProjectRow[];
    const milestoneRows = (milestones.data ?? []) as unknown as MilestoneRow[];
    const aiRows = (actionItems.data ?? []) as unknown as ActionItemRow[];
    const updateRows = (updates.data ?? []) as unknown as Array<{
      created_at: string;
    }>;
    const historyRows = (history.data ?? []) as unknown as Array<{
      changed_at: string;
    }>;

    // --- stat tiles
    const monthStart = iso(
      new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)),
    );
    const weekAhead = new Date(now);
    weekAhead.setUTCDate(weekAhead.getUTCDate() + 7);
    const activeProjects = projectRows.filter(
      (p) => !CLOSED_PROJECT.has((p.status?.name ?? '').toLowerCase()),
    ).length;
    const openAi = aiRows.filter((a) => a.status === 'open');
    const overdueAi = openAi.filter(
      (a) => a.due_date != null && a.due_date < today,
    );
    const overdueMs = milestoneRows.filter(
      (m) => m.status === 'open' && m.due_date != null && m.due_date < today,
    );
    const msThisMonth = milestoneRows.filter(
      (m) =>
        m.due_date != null &&
        m.due_date >= monthStart &&
        m.due_date <= iso(weekAheadEnd(now)),
    );

    function weekAheadEnd(base: Date): Date {
      return new Date(
        Date.UTC(base.getUTCFullYear(), base.getUTCMonth() + 1, 0),
      );
    }

    // --- weekly buckets (8 weeks, oldest first)
    const weekBuckets: Array<{
      startIso: string;
      endIso: string;
      label: string;
    }> = [];
    for (let i = 7; i >= 0; i--) {
      const start = new Date(thisWeek);
      start.setUTCDate(start.getUTCDate() - 7 * i);
      const end = new Date(start);
      end.setUTCDate(end.getUTCDate() + 7);
      weekBuckets.push({
        startIso: start.toISOString(),
        endIso: end.toISOString(),
        label: `${start.getUTCDate()}/${start.getUTCMonth() + 1}`,
      });
    }
    const inBucket = (ts: string, b: { startIso: string; endIso: string }) =>
      ts >= b.startIso && ts < b.endIso;

    const updatesPerWeek = weekBuckets.map((b) => ({
      label: b.label,
      value: updateRows.filter((u) => inBucket(u.created_at, b)).length,
    }));
    const flowCreated = weekBuckets.map(
      (b) => aiRows.filter((a) => inBucket(a.created_at, b)).length,
    );
    const flowCompleted = weekBuckets.map(
      (b) =>
        aiRows.filter((a) => a.status === DONE && inBucket(a.updated_at, b))
          .length,
    );

    // --- groupings
    const byName = (rows: Array<string>, fallback: string) => {
      const counts = new Map<string, number>();
      for (const name of rows) {
        const key = name || fallback;
        counts.set(key, (counts.get(key) ?? 0) + 1);
      }
      return [...counts.entries()]
        .map(([label, value]) => ({ label, value }))
        .sort((a, b) => b.value - a.value);
    };

    // --- milestones per month (last 6 months by completed_date)
    const months: Array<{ prefix: string; label: string }> = [];
    for (let i = 5; i >= 0; i--) {
      const m = new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1),
      );
      months.push({
        prefix: m.toISOString().slice(0, 7),
        label: m.toLocaleDateString('en-US', {
          month: 'short',
          timeZone: 'UTC',
        }),
      });
    }
    const milestonesPerMonth = months.map((m) => ({
      label: m.label,
      value: milestoneRows.filter((row) =>
        (row.completed_date ?? '').startsWith(m.prefix),
      ).length,
    }));

    // --- heatmap: 12 weeks x Mon-Fri counts
    const heat: number[][] = Array.from({ length: 12 }, () => [0, 0, 0, 0, 0]);
    for (const h of historyRows) {
      const d = new Date(h.changed_at);
      const wk = Math.floor(
        (weekStart(d).getTime() - heatFrom.getTime()) / (7 * 86400000),
      );
      const weekday = (d.getUTCDay() + 6) % 7; // Mon=0
      if (wk >= 0 && wk < 12 && weekday < 5) heat[wk][weekday] += 1;
    }

    const activeMs = milestoneRows.filter((m) => m.status !== NA);
    return {
      stats: {
        active_projects: activeProjects,
        projects_created_this_month: projectRows.filter(
          (p) => p.created_at >= monthStart,
        ).length,
        open_action_items: openAi.length,
        action_items_due_this_week: openAi.filter(
          (a) =>
            a.due_date != null &&
            a.due_date >= today &&
            a.due_date <= iso(weekAhead),
        ).length,
        milestones_this_month: msThisMonth.length,
        major_milestones_this_month: msThisMonth.filter((m) => m.is_major)
          .length,
        overdue_items: overdueAi.length + overdueMs.length,
      },
      updates_per_week: updatesPerWeek,
      projects_by_status: byName(
        projectRows.map((p) => p.status?.name ?? ''),
        'Unknown',
      ),
      action_items: {
        open: openAi.length - overdueAi.length,
        closed: aiRows.filter((a) => a.status === DONE).length,
        overdue: overdueAi.length,
      },
      projects_by_category: byName(
        projectRows.map((p) => p.category?.name ?? ''),
        'Uncategorized',
      ),
      milestones_per_month: milestonesPerMonth,
      flow: {
        labels: weekBuckets.map((b) => b.label),
        created: flowCreated,
        completed: flowCompleted,
      },
      overall_milestones: {
        done: activeMs.filter((m) => m.status === DONE).length,
        total: activeMs.length,
      },
      heat,
    };
  }
}
