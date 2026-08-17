import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { toHttpException } from '../../common/supabase-error';
import {
  calculatedProgress,
  initiativeBucket,
  plannedProgress,
} from '../../common/formulas';
import { ProjectAccessService } from '../../common/access/project-access.service';

const MONTH_LABELS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

/** FR-12 named portfolio reports (Initiative Progress, Monthly Performance). */
@Injectable()
export class ReportsService {
  constructor(
    private readonly db: DatabaseService,
    private readonly access: ProjectAccessService,
  ) {}

  /**
   * One row per project: planned vs calculated progress (F1/F2), delta and
   * F5 bucket — all PROVISIONAL per docs/FORMULAS.md. Worst delta first;
   * cancelled projects keep a null bucket.
   */
  async initiativeProgress(userId: string) {
    const [projects, milestones] = await Promise.all([
      this.db.client.from('projects').select(
        `id, name, reference_id, start_date, target_end_date,
         status:project_statuses ( name ),
         owner:profiles!owner_id ( full_name, email ),
         project_manager:profiles!project_manager_id ( full_name, email )`,
      ),
      this.db.client
        .from('milestones')
        .select('project_id, status, weightage, percent_complete'),
    ]);
    if (projects.error)
      throw toHttpException(projects.error, 'reports.initiativeProgress');
    if (milestones.error)
      throw toHttpException(milestones.error, 'reports.initiativeProgress');

    type Person = { full_name: string | null; email: string | null } | null;
    type ProjectRow = {
      id: string;
      name: string;
      reference_id: string | null;
      start_date: string | null;
      target_end_date: string | null;
      status: { name: string } | null;
      owner: Person;
      project_manager: Person;
    };
    type MilestoneRow = {
      project_id: string;
      status: string;
      weightage: number | null;
      percent_complete: number | null;
    };
    const hidden = await this.access.hiddenProjectIds(userId);
    const projectRows = (
      (projects.data ?? []) as unknown as ProjectRow[]
    ).filter((p) => !hidden.has(p.id));
    const milestoneRows = (milestones.data ?? []) as unknown as MilestoneRow[];

    const msByProject = new Map<string, MilestoneRow[]>();
    for (const m of milestoneRows) {
      (
        msByProject.get(m.project_id) ??
        msByProject.set(m.project_id, []).get(m.project_id)
      )?.push(m);
    }

    const rows = projectRows.map((p) => {
      const ms = msByProject.get(p.id) ?? [];
      const active = ms.filter((m) => m.status !== 'not_applicable');
      const calculated = calculatedProgress(ms);
      const planned = plannedProgress(p.start_date, p.target_end_date);
      return {
        project_id: p.id,
        name: p.name,
        reference_id: p.reference_id,
        owner: p.owner?.full_name ?? p.owner?.email ?? null,
        project_manager:
          p.project_manager?.full_name ?? p.project_manager?.email ?? null,
        status: p.status?.name ?? null,
        start_date: p.start_date,
        target_end_date: p.target_end_date,
        planned,
        calculated,
        delta:
          calculated === null && planned === null
            ? null
            : (calculated ?? 0) - (planned ?? 0),
        bucket: initiativeBucket(p.status?.name, calculated, planned),
        milestones_done: active.filter((m) => m.status === 'closed_completed')
          .length,
        milestones_total: active.length,
      };
    });
    rows.sort(
      (a, b) =>
        (a.delta ?? Number.MAX_SAFE_INTEGER) -
        (b.delta ?? Number.MAX_SAFE_INTEGER),
    );
    return { rows };
  }

  /**
   * Per calendar month of `year`: milestones due / completed-of-due /
   * completed-in-month, plus submission and approval counts for that
   * month's cycle.
   */
  async monthlyPerformance(year: number, userId: string) {
    const [milestones, submissions] = await Promise.all([
      this.db.client
        .from('milestones')
        .select('project_id, status, due_date, completed_date'),
      this.db.client
        .from('submissions')
        .select('project_id, status, cycle:cycles!inner ( period_start )')
        .gte('cycles.period_start', `${year}-01-01`)
        .lte('cycles.period_start', `${year}-12-31`),
    ]);
    if (milestones.error)
      throw toHttpException(milestones.error, 'reports.monthlyPerformance');
    if (submissions.error)
      throw toHttpException(submissions.error, 'reports.monthlyPerformance');

    const hidden = await this.access.hiddenProjectIds(userId);
    const milestoneRows = (
      (milestones.data ?? []) as unknown as Array<{
        project_id: string;
        status: string;
        due_date: string | null;
        completed_date: string | null;
      }>
    ).filter((m) => !hidden.has(m.project_id));
    const submissionRows = (
      (submissions.data ?? []) as unknown as Array<{
        project_id: string;
        status: string;
        cycle: { period_start: string } | null;
      }>
    ).filter((s) => !hidden.has(s.project_id));
    const activeMs = milestoneRows.filter((m) => m.status !== 'not_applicable');

    const months = MONTH_LABELS.map((label, i) => {
      const prefix = `${year}-${String(i + 1).padStart(2, '0')}`;
      const due = activeMs.filter((m) => m.due_date?.startsWith(prefix));
      const subs = submissionRows.filter((s) =>
        s.cycle?.period_start.startsWith(prefix),
      );
      return {
        label,
        due: due.length,
        done: due.filter((m) => m.status === 'closed_completed').length,
        completed: activeMs.filter((m) => m.completed_date?.startsWith(prefix))
          .length,
        submitted: subs.length,
        approved: subs.filter((s) => s.status === 'approved').length,
      };
    });
    return { year, months };
  }
}
