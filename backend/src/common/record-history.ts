/**
 * Shared shape for the `record_history` audit table (see db/record_history.sql).
 *
 * Old/new values are already display-ready text — the Postgres trigger resolves
 * foreign keys to names and formats dates at write time, so history shows what a
 * value WAS at the time of the change rather than what it resolves to today.
 */
export interface HistoryEntry {
  id: string;
  event: 'created' | 'changed';
  /** null for 'created' entries. */
  field_label: string | null;
  old_value: string | null;
  new_value: string | null;
  changed_at: string;
  actor: { full_name: string | null; email: string | null } | null;
}

export const HISTORY_SELECT =
  'id, event, field_label, old_value, new_value, changed_at, ' +
  'actor:profiles!changed_by ( full_name, email )';
