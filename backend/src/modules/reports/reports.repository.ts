import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { toHttpException } from '../../common/supabase-error';

type Person = { full_name: string | null; email: string | null } | null;

export interface ReportProjectRow {
  id: string;
  name: string;
  reference_id: string | null;
  start_date: string | null;
  target_end_date: string | null;
  status: { name: string } | null;
  owner: Person;
  project_manager: Person;
}

export interface MilestoneProgressRow {
  project_id: string;
  status: string;
  weightage: number | null;
  percent_complete: number | null;
}

export interface MilestoneDateRow {
  project_id: string;
  status: string;
  due_date: string | null;
  completed_date: string | null;
}

export interface SubmissionCycleRow {
  project_id: string;
  status: string;
  cycle: { period_start: string } | null;
}

/**
 * Portfolio-wide reads for the named reports.
 *
 * Extracted from the service (REFACTOR-PLAN v2, Phase 0) so the aggregation,
 * the formula application and the FR-15 filtering above it can be tested. Every
 * method fetches unfiltered: what the caller may see is policy.
 */
@Injectable()
export class ReportsRepository {
  constructor(private readonly db: DatabaseService) {}

  async allProjects(): Promise<ReportProjectRow[]> {
    const { data, error } = await this.db.client.from('projects').select(
      `id, name, reference_id, start_date, target_end_date,
         status:project_statuses ( name ),
         owner:profiles!owner_id ( full_name, email ),
         project_manager:profiles!project_manager_id ( full_name, email )`,
    );
    if (error) throw toHttpException(error, 'reports.projects');
    return (data ?? []) as unknown as ReportProjectRow[];
  }

  async allMilestoneProgress(): Promise<MilestoneProgressRow[]> {
    const { data, error } = await this.db.client
      .from('milestones')
      .select('project_id, status, weightage, percent_complete');
    if (error) throw toHttpException(error, 'reports.milestoneProgress');
    return data ?? [];
  }

  async allMilestoneDates(): Promise<MilestoneDateRow[]> {
    const { data, error } = await this.db.client
      .from('milestones')
      .select('project_id, status, due_date, completed_date');
    if (error) throw toHttpException(error, 'reports.milestoneDates');
    return data ?? [];
  }

  /** Submissions whose cycle starts inside the given calendar year. */
  async submissionsInYear(year: number): Promise<SubmissionCycleRow[]> {
    const { data, error } = await this.db.client
      .from('submissions')
      .select('project_id, status, cycle:cycles!inner ( period_start )')
      .gte('cycles.period_start', `${year}-01-01`)
      .lte('cycles.period_start', `${year}-12-31`);
    if (error) throw toHttpException(error, 'reports.submissions');
    return (data ?? []) as unknown as SubmissionCycleRow[];
  }
}
