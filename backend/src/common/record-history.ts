/**
 * Shared shape for the `record_history` audit table (see db/record_history.sql).
 *
 * Old/new values are already display-ready text — the Postgres trigger resolves
 * foreign keys to names and formats dates at write time, so history shows what a
 * value WAS at the time of the change rather than what it resolves to today.
 */
export interface HistoryEntry {
  id: string;
  event: 'created' | 'changed' | 'deleted';
  /** Present on project-wide history (which table the row came from). */
  table_name?: string;
  /** null for 'created'/'deleted' entries. */
  field_label: string | null;
  old_value: string | null;
  new_value: string | null;
  changed_at: string;
  actor: { full_name: string | null; email: string | null } | null;
}

export const HISTORY_SELECT =
  'id, event, field_label, old_value, new_value, changed_at, ' +
  'actor:profiles!changed_by ( full_name, email )';

/** Project-wide feed additionally carries the source table. */
export const PROJECT_HISTORY_SELECT =
  'id, event, table_name, field_label, old_value, new_value, changed_at, ' +
  'actor:profiles!changed_by ( full_name, email )';

/**
 * A history row written from the service layer rather than the DB trigger.
 *
 * Needed for many-to-many fields: the trigger only sees the parent row, so
 * changes that live in a join table (action item owners) never reach it.
 */
export interface HistoryInsert {
  table_name: string;
  record_id: string;
  project_id: string;
  field_label: string;
  old_value: string;
  new_value: string;
  changed_by: string;
}
