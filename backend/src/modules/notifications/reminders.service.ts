import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { DatabaseService } from '../../database/database.service';
import { NotificationsService } from './notifications.service';
import {
  classifyDue,
  inSubmissionWindow,
  reminderType,
  resolveRecipients,
  submissionPendingType,
} from './reminders.logic';

interface ProjectRef {
  name: string;
  project_manager_id: string | null;
  owner_id: string | null;
}

interface DueActionItem {
  id: string;
  title: string;
  due_date: string;
  project_id: string;
  owner_id: string | null;
  owners: Array<{ user_id: string }>;
  project: ProjectRef | null;
}

interface DueMilestone {
  id: string;
  name: string;
  due_date: string;
  project_id: string;
  owner_id: string | null;
  project: ProjectRef | null;
}

const localIso = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate(),
  ).padStart(2, '0')}`;

/**
 * Time-based notifications (FDD 3.9). One in-process daily sweep — no
 * external scheduler infra — plus a catch-up run shortly after boot so a
 * restarted server still delivers today's reminders (the dedup key makes
 * re-runs no-ops). Best-effort throughout: a failed sweep only logs.
 */
@Injectable()
export class RemindersService implements OnApplicationBootstrap {
  private readonly logger = new Logger(RemindersService.name);

  constructor(
    private readonly db: DatabaseService,
    private readonly notifications: NotificationsService,
  ) {}

  onApplicationBootstrap(): void {
    setTimeout(() => {
      this.sweep().catch((err: Error) =>
        this.logger.warn(`Startup reminder sweep failed: ${err.message}`),
      );
    }, 5_000);
  }

  @Cron('0 7 * * *')
  async runDaily(): Promise<void> {
    try {
      await this.sweep();
    } catch (err) {
      this.logger.warn(
        `Daily reminder sweep failed: ${(err as Error).message}`,
      );
    }
  }

  async sweep(): Promise<{ sent: number }> {
    const now = new Date();
    const todayIso = localIso(now);
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    const tomorrowIso = localIso(tomorrow);

    const [ais, ms, existing] = await Promise.all([
      this.db.client
        .from('action_items')
        .select(
          `id, title, due_date, project_id, owner_id,
           owners:action_item_owners ( user_id ),
           project:projects ( name, project_manager_id, owner_id )`,
        )
        .eq('status', 'open')
        .not('due_date', 'is', null)
        .lte('due_date', tomorrowIso),
      this.db.client
        .from('milestones')
        .select(
          `id, name, due_date, project_id, owner_id,
           project:projects ( name, project_manager_id, owner_id )`,
        )
        .eq('status', 'open')
        .not('due_date', 'is', null)
        .lte('due_date', tomorrowIso),
      this.db.client
        .from('notifications')
        .select('user_id, type')
        .like('type', 'reminder:%'),
    ]);
    const failed = ais.error ?? ms.error ?? existing.error;
    if (failed) {
      this.logger.warn(`Reminder sweep query failed: ${failed.message}`);
      return { sent: 0 };
    }

    const already = new Set(
      (existing.data ?? []).map((n) => `${n.user_id}|${n.type}`),
    );
    let sent = 0;

    const emit = async (
      recordKind: 'action_item' | 'milestone',
      record: { id: string; due_date: string; project_id: string },
      label: string,
      project: ProjectRef | null,
      recipients: string[],
    ) => {
      const kind = classifyDue(record.due_date, todayIso, tomorrowIso);
      if (!kind) return;
      const type = reminderType(kind, recordKind, record.id, record.due_date);
      const noun = recordKind === 'action_item' ? 'Action item' : 'Milestone';
      const where = project?.name ? ` in ${project.name}` : '';
      const title =
        kind === 'overdue' ? `Overdue: ${label}` : `Due soon: ${label}`;
      const body =
        kind === 'overdue'
          ? `${noun}${where} was due ${record.due_date}.`
          : `${noun}${where} is due ${record.due_date}.`;
      for (const userId of recipients) {
        if (already.has(`${userId}|${type}`)) continue;
        already.add(`${userId}|${type}`);
        await this.notifications.notify({
          userId,
          projectId: record.project_id,
          type,
          title,
          body,
        });
        sent += 1;
      }
    };

    for (const a of (ais.data ?? []) as unknown as DueActionItem[]) {
      await emit(
        'action_item',
        a,
        a.title,
        a.project,
        resolveRecipients(
          [...(a.owners ?? []).map((o) => o.user_id), a.owner_id],
          [a.project?.project_manager_id, a.project?.owner_id],
        ),
      );
    }
    for (const m of (ms.data ?? []) as unknown as DueMilestone[]) {
      await emit(
        'milestone',
        m,
        m.name,
        m.project,
        resolveRecipients(
          [m.owner_id],
          [m.project?.project_manager_id, m.project?.owner_id],
        ),
      );
    }

    sent += await this.submissionPendingSweep(todayIso, already);

    this.logger.log(`Reminder sweep: ${sent} notification(s) created.`);
    return { sent };
  }

  /**
   * FDD 3.9 pre-cycle reminder: in the run-up to period_end, nudge the PM
   * (fallback: owner) of every project whose current-cycle submission is
   * still missing, draft, or returned. Once per project per cycle (the
   * dedup key embeds period_start); skipped when the cycle is closed.
   */
  private async submissionPendingSweep(
    todayIso: string,
    already: Set<string>,
  ): Promise<number> {
    if (!inSubmissionWindow(todayIso)) return 0;

    const periodStart = `${todayIso.slice(0, 7)}-01`;
    const [cycle, subs, projects] = await Promise.all([
      this.db.client
        .from('cycles')
        .select('id, name, period_end, status')
        .eq('period_start', periodStart)
        .maybeSingle<{
          id: string;
          name: string;
          period_end: string;
          status: string;
        }>(),
      this.db.client
        .from('submissions')
        .select('project_id, status, cycle:cycles!inner ( period_start )')
        .eq('cycles.period_start', periodStart),
      this.db.client
        .from('projects')
        .select('id, name, project_manager_id, owner_id'),
    ]);
    const failed = cycle.error ?? subs.error ?? projects.error;
    if (failed) {
      this.logger.warn(`Submission-pending sweep failed: ${failed.message}`);
      return 0;
    }
    // A closed cycle takes no more submissions — nudging would be noise.
    if (cycle.data?.status === 'closed') return 0;

    const submitted = new Set(
      ((subs.data ?? []) as Array<{ project_id: string; status: string }>)
        .filter((s) => !['draft', 'returned'].includes(s.status))
        .map((s) => s.project_id),
    );
    const cycleName =
      cycle.data?.name ??
      new Date(`${periodStart}T00:00:00Z`).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC',
      });

    let sent = 0;
    type ProjectRow = {
      id: string;
      name: string;
      project_manager_id: string | null;
      owner_id: string | null;
    };
    for (const p of (projects.data ?? []) as ProjectRow[]) {
      if (submitted.has(p.id)) continue;
      const type = submissionPendingType(p.id, periodStart);
      for (const userId of resolveRecipients(
        [p.project_manager_id],
        [p.owner_id],
      )) {
        if (already.has(`${userId}|${type}`)) continue;
        already.add(`${userId}|${type}`);
        await this.notifications.notify({
          userId,
          projectId: p.id,
          type,
          title: `Progress update pending: ${p.name}`,
          body: `The ${cycleName} submission has not been sent for review${
            cycle.data?.period_end
              ? ` — the cycle ends ${cycle.data.period_end}`
              : ''
          }.`,
        });
        sent += 1;
      }
    }
    return sent;
  }
}
