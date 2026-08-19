import { Injectable } from '@nestjs/common';
import {
  calculatedProgress,
  initiativeBucket,
  plannedProgress,
} from '../../common/formulas';
import { ProjectAccessService } from '../../common/access/project-access.service';
import {
  ReportsRepository,
  type MilestoneProgressRow,
} from './reports.repository';

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

/** A project with no computable delta sorts last, not first. */
const NO_DELTA = Number.MAX_SAFE_INTEGER;

/** FR-12 named portfolio reports (Initiative Progress, Monthly Performance). */
@Injectable()
export class ReportsService {
  constructor(
    private readonly repo: ReportsRepository,
    private readonly access: ProjectAccessService,
  ) {}

  /**
   * One row per project: planned vs calculated progress (F1/F2), delta and
   * F5 bucket — all PROVISIONAL per docs/FORMULAS.md. Worst delta first;
   * cancelled projects keep a null bucket.
   */
  async initiativeProgress(userId: string) {
    const [projects, milestones] = await Promise.all([
      this.repo.allProjects(),
      this.repo.allMilestoneProgress(),
    ]);
    const hidden = await this.access.hiddenProjectIds(userId);
    const byProject = groupByProject(milestones);

    const rows = projects
      .filter((p) => !hidden.has(p.id))
      .map((p) => {
        const ms = byProject.get(p.id) ?? [];
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
          // Null only when neither number exists: a project with one of them
          // still has a meaningful gap.
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
    rows.sort((a, b) => (a.delta ?? NO_DELTA) - (b.delta ?? NO_DELTA));
    return { rows };
  }

  /**
   * Per calendar month of `year`: milestones due / completed-of-due /
   * completed-in-month, plus submission and approval counts for that
   * month's cycle.
   */
  async monthlyPerformance(year: number, userId: string) {
    const [milestones, submissions] = await Promise.all([
      this.repo.allMilestoneDates(),
      this.repo.submissionsInYear(year),
    ]);
    const hidden = await this.access.hiddenProjectIds(userId);
    const activeMs = milestones.filter(
      (m) => !hidden.has(m.project_id) && m.status !== 'not_applicable',
    );
    const subs = submissions.filter((s) => !hidden.has(s.project_id));

    const months = MONTH_LABELS.map((label, i) => {
      // Dates are yyyy-mm-dd, so a string prefix is a month filter.
      const prefix = `${year}-${String(i + 1).padStart(2, '0')}`;
      const due = activeMs.filter((m) => m.due_date?.startsWith(prefix));
      const inMonth = subs.filter((s) =>
        s.cycle?.period_start.startsWith(prefix),
      );
      return {
        label,
        due: due.length,
        done: due.filter((m) => m.status === 'closed_completed').length,
        // Completed *in* this month, whenever it was due.
        completed: activeMs.filter((m) => m.completed_date?.startsWith(prefix))
          .length,
        submitted: inMonth.length,
        approved: inMonth.filter((s) => s.status === 'approved').length,
      };
    });
    return { year, months };
  }
}

function groupByProject(
  rows: MilestoneProgressRow[],
): Map<string, MilestoneProgressRow[]> {
  const byProject = new Map<string, MilestoneProgressRow[]>();
  for (const row of rows) {
    const bucket = byProject.get(row.project_id);
    if (bucket) bucket.push(row);
    else byProject.set(row.project_id, [row]);
  }
  return byProject;
}
