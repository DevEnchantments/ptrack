/**
 * P-Track calculation registry — implementations of docs/FORMULAS.md.
 * PROVISIONAL formulas, adopted 2026-08-03 pending supervisor confirmation.
 * F1/F2 mirror backend/src/common/formulas.ts by design (same definitions).
 */

export interface MilestoneProgressRow {
  status: string
  weightage: number | null
  percent_complete: number | null
}

/** F1 — weighted milestone completion, 0-100, null when not computable. */
export function calculatedProgress(
  milestones: MilestoneProgressRow[],
): number | null {
  const active = milestones.filter((m) => m.status !== 'not_applicable')
  if (active.length === 0) return null
  const anyWeight = active.some((m) => (m.weightage ?? 0) > 0)
  let weightSum = 0
  let acc = 0
  for (const m of active) {
    const weight = anyWeight ? (m.weightage ?? 0) : 1
    const pct =
      m.percent_complete ?? (m.status === 'closed_completed' ? 100 : 0)
    weightSum += weight
    acc += weight * Math.min(Math.max(pct, 0), 100)
  }
  if (weightSum <= 0) return null
  return Math.round(acc / weightSum)
}

/** F2 — straight-line planned progress between start and target end. */
export function plannedProgress(
  startDate: string | null,
  targetEndDate: string | null,
  today: string = new Date().toISOString().slice(0, 10),
): number | null {
  if (!startDate || !targetEndDate || targetEndDate <= startDate) return null
  if (today <= startDate) return 0
  if (today >= targetEndDate) return 100
  const elapsed = Date.parse(today) - Date.parse(startDate)
  const total = Date.parse(targetEndDate) - Date.parse(startDate)
  return Math.round((elapsed / total) * 100)
}

/** F3 — probability x impact via lookup sort orders (1-3 scales -> 1-9). */
export function riskScore(
  probability?: { sort_order: number | null } | null,
  impact?: { sort_order: number | null } | null,
): number | null {
  if (probability?.sort_order == null || impact?.sort_order == null) return null
  return probability.sort_order * impact.sort_order
}

/** F3 — severity band for the register dot. */
export function riskSeverityTone(score: number): 'green' | 'amber' | 'red' {
  if (score >= 6) return 'red'
  if (score >= 3) return 'amber'
  return 'green'
}

/** F4 — display-only at-risk suggestion; never writes the manual flag. */
export function atRiskSuggested(
  milestones: Array<{ status: string; due_date: string | null }>,
  calculated: number | null,
  planned: number | null,
  today: string = new Date().toISOString().slice(0, 10),
): boolean {
  const overdue = milestones.some(
    (m) => m.status === 'open' && m.due_date != null && m.due_date < today,
  )
  const behind =
    calculated != null && planned != null && calculated + 15 < planned
  return overdue || behind
}
