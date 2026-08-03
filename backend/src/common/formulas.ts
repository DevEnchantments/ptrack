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
