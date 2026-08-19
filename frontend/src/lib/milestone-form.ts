/**
 * The rules behind the Add/Edit Milestone dialog, as pure functions.
 *
 * A form holds strings: a checkbox is "true", a number is text, and tags are
 * one comma-separated field. Turning that into an API payload is a set of
 * decisions (what counts as empty, what becomes undefined rather than null,
 * how a number is parsed) that were previously buried in a submit handler and
 * could only be exercised by driving the UI.
 *
 * These live in lib/ rather than beside the component because a file exporting
 * a React component must export only components (react-refresh), the same
 * reason lib/project-form.ts exists.
 */

export interface MilestoneFormValues {
  name: string;
  startDate: string;
  dueDate: string;
  status: string;
  roleId: string | null;
  ownerId: string | null;
  isMajor: string;
  description: string;
  /** Raw comma-separated field, exactly as typed. */
  tags: string;
  weightage: string;
  percent: string;
  dependsOn: string[];
}

/** Field name -> message, for the inline errors under each input. */
export type FieldErrors = Record<string, string>;

/**
 * What must be filled in before the dialog will submit. Everything else the
 * server validates; these three are checked here so the user is told without
 * a round-trip.
 */
export function milestoneFormErrors(values: MilestoneFormValues): FieldErrors {
  const errors: FieldErrors = {};
  if (!values.name.trim()) errors.name = 'A milestone name is required.';
  if (!values.startDate) errors.startDate = 'A start date is required.';
  if (!values.dueDate) errors.dueDate = 'A due date is required.';
  return errors;
}

/** A comma-separated field as a list, ignoring blanks and stray spaces. */
export function parseTags(raw: string): string[] {
  return raw
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);
}

/**
 * The API payload for a milestone save.
 *
 * `undefined` rather than `null` throughout: the backend's patch builders only
 * write fields that were actually sent, so undefined means "leave it alone"
 * while null would mean "clear it". `outcome_id` is the exception, since
 * clearing an outcome is a thing the dialog can do.
 */
export function milestoneFormPayload(
  values: MilestoneFormValues,
  outcomeId: string | null,
) {
  const tags = parseTags(values.tags);
  return {
    name: values.name.trim(),
    start_date: values.startDate,
    due_date: values.dueDate,
    status: values.status,
    role_id: values.roleId ?? undefined,
    owner_id: values.ownerId ?? undefined,
    is_major: values.isMajor === 'true',
    description: values.description.trim() || undefined,
    tags: tags.length ? tags : undefined,
    weightage: values.weightage.trim() ? Number(values.weightage) : undefined,
    percent_complete: values.percent.trim() ? Number(values.percent) : undefined,
    outcome_id: outcomeId,
    depends_on: values.dependsOn,
  };
}
