/**
 * FDD 3.3.2: what makes a project submittable.
 *
 * Kept as a pure function of the two rows it judges, with no I/O: this is the
 * rule most likely to change (the mandatory list is spec-driven), and it is
 * the part worth reading on its own.
 */

export interface GateProject {
  name: string | null;
  reference_id: string | null;
  plan_year: number | null;
  owner_id: string | null;
  sponsor: string | null;
  sector_id: string | null;
  target_end_date: string | null;
  approved_budget: number | null;
}

export interface GateMilestone {
  status: string;
  weightage: number | null;
}

/** Milestone weights must total this before a project may be submitted. */
const WEIGHT_TOTAL = 100;

/** Floating-point slack, so 33.333 + 33.333 + 33.334 is accepted. */
const WEIGHT_TOLERANCE = 0.001;

/** Field, and the wording used when it is missing. */
const MANDATORY: Array<[keyof GateProject, string]> = [
  ['name', 'name'],
  ['reference_id', 'reference ID'],
  ['plan_year', 'plan year'],
  ['owner_id', 'project owner'],
  ['sponsor', 'sponsor'],
  ['sector_id', 'sector'],
  ['target_end_date', 'target end date'],
  ['approved_budget', 'approved budget'],
];

/**
 * Everything blocking submission, in one list, so the caller can report them
 * together rather than one per attempt. Empty means submittable.
 *
 * "Missing" is null/undefined or an empty string — deliberately NOT falsy, so
 * an approved budget of 0 counts as answered.
 */
export function submissionGateFailures(
  project: GateProject,
  milestones: GateMilestone[],
): string[] {
  const failures = MANDATORY.filter(([field]) => {
    const value = project[field];
    return value == null || value === '';
  }).map(([, label]) => `missing ${label}`);

  // A project with nothing planned is not blocked for having nothing to weigh.
  const active = milestones.filter((m) => m.status !== 'not_applicable');
  if (active.length > 0) {
    const total = active.reduce((sum, m) => sum + (m.weightage ?? 0), 0);
    if (Math.abs(total - WEIGHT_TOTAL) > WEIGHT_TOLERANCE) {
      failures.push(`milestone weights total ${total}, not ${WEIGHT_TOTAL}`);
    }
  }
  return failures;
}
