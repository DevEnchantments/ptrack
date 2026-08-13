/**
 * Pure logic for due-date reminders (kept side-effect-free for unit testing).
 *
 * Policy (ASSUMED, docs/FDD-ALIGNMENT.md 3.9): a record reminds at two
 * moments only — when it comes due (today/tomorrow) and once it is overdue —
 * never as a daily nag. The dedup key embeds the due date, so replanning a
 * record legitimately re-arms both reminders for the new date.
 */

export type ReminderKind = 'due_soon' | 'overdue';

/** Dates are ISO `yyyy-mm-dd` strings; string comparison is date comparison. */
export function classifyDue(
  dueDate: string,
  todayIso: string,
  tomorrowIso: string,
): ReminderKind | null {
  if (dueDate < todayIso) return 'overdue';
  if (dueDate === todayIso || dueDate === tomorrowIso) return 'due_soon';
  return null;
}

/**
 * Notification `type` doubles as the dedup key. The bell UI renders only
 * title/body, so the structured type is invisible to users.
 */
export function reminderType(
  kind: ReminderKind,
  recordKind: 'action_item' | 'milestone',
  recordId: string,
  dueDate: string,
): string {
  return `reminder:${kind}:${recordKind}:${recordId}:${dueDate}`;
}

/**
 * Pre-cycle nudge window (ASSUMED): the last `days` calendar days of the
 * month, i.e. the run-up to the reporting cycle's period_end.
 */
export function inSubmissionWindow(todayIso: string, days = 5): boolean {
  const [y, m, d] = todayIso.split('-').map(Number);
  const lastDay = new Date(Date.UTC(y, m, 0)).getUTCDate();
  return lastDay - d < days;
}

/** Dedup key: one pending-submission nudge per project per cycle. */
export function submissionPendingType(
  projectId: string,
  periodStart: string,
): string {
  return `reminder:submission_pending:project:${projectId}:${periodStart}`;
}

/**
 * Explicit owners win (all of them); otherwise the first available fallback
 * (project manager, then project owner). Empty when nobody is set.
 */
export function resolveRecipients(
  owners: Array<string | null | undefined>,
  fallbacks: Array<string | null | undefined>,
): string[] {
  const owned = [...new Set(owners.filter((o): o is string => Boolean(o)))];
  if (owned.length > 0) return owned;
  for (const f of fallbacks) if (f) return [f];
  return [];
}
