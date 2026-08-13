/**
 * P-Track calculation registry — implementations of docs/FORMULAS.md.
 * PROVISIONAL formulas (F1/F2), adopted 2026-08-03 pending supervisor
 * confirmation. Mirrored in frontend/src/lib/formulas.ts by design.
 */

export interface MilestoneProgressRow {
  status: string;
  weightage: number | null;
  percent_complete: number | null;
}

/** F1 — weighted milestone completion, 0-100, null when not computable. */
export function calculatedProgress(
  milestones: MilestoneProgressRow[],
): number | null {
  const active = milestones.filter((m) => m.status !== 'not_applicable');
  if (active.length === 0) return null;
  const anyWeight = active.some((m) => (m.weightage ?? 0) > 0);
  let weightSum = 0;
  let acc = 0;
  for (const m of active) {
    const weight = anyWeight ? (m.weightage ?? 0) : 1;
    const pct =
      m.percent_complete ?? (m.status === 'closed_completed' ? 100 : 0);
    weightSum += weight;
    acc += weight * Math.min(Math.max(pct, 0), 100);
  }
  if (weightSum <= 0) return null;
  return Math.round(acc / weightSum);
}

/** F3 — probability x impact via lookup sort orders (1-3 scales -> 1-9). */
export function riskScore(
  probability?: { sort_order: number | null } | null,
  impact?: { sort_order: number | null } | null,
): number | null {
  if (probability?.sort_order == null || impact?.sort_order == null)
    return null;
  return probability.sort_order * impact.sort_order;
}

/** F3 red band: scores at or above this are "high severity". */
export const RISK_HIGH_THRESHOLD = 6;

export const INITIATIVE_BUCKETS = [
  'Completed',
  'Over-Achieved',
  'On Target',
  'Needs Attention',
  'Off Target',
  'Severely Off Target',
  'Not Started',
] as const;
export type InitiativeBucket = (typeof INITIATIVE_BUCKETS)[number];

/**
 * F5 — delivery bucket from project status + progress delta
 * (calculated - planned). Returns null for cancelled projects (excluded).
 */
export function initiativeBucket(
  statusName: string | null | undefined,
  calculated: number | null,
  planned: number | null,
): InitiativeBucket | null {
  const st = (statusName ?? '').toLowerCase();
  if (st.includes('cancel')) return null;
  if (st.includes('completed') || st === 'complete' || st === 'closed')
    return 'Completed';
  if (st.includes('not started')) return 'Not Started';
  if (calculated === null && planned === null) return 'Not Started';
  const delta = (calculated ?? 0) - (planned ?? 0);
  return delta >= 10
    ? 'Over-Achieved'
    : delta >= -5
      ? 'On Target'
      : delta >= -15
        ? 'Needs Attention'
        : delta >= -30
          ? 'Off Target'
          : 'Severely Off Target';
}

/** F2 — straight-line planned progress between start and target end. */
export function plannedProgress(
  startDate: string | null,
  targetEndDate: string | null,
  today: string = new Date().toISOString().slice(0, 10),
): number | null {
  if (!startDate || !targetEndDate || targetEndDate <= startDate) return null;
  if (today <= startDate) return 0;
  if (today >= targetEndDate) return 100;
  const elapsed = Date.parse(today) - Date.parse(startDate);
  const total = Date.parse(targetEndDate) - Date.parse(startDate);
  return Math.round((elapsed / total) * 100);
}
