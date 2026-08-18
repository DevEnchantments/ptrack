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


/** Reporting periods per year for F7's timeliness expectation. */
const PERIODS_PER_YEAR: Record<string, number> = {
  weekly: 52,
  monthly: 12,
  quarterly: 4,
  'semi-annual': 2,
  semiannual: 2,
  annual: 1,
  yearly: 1,
}

export interface KpiScoreInput {
  polarity: string
  target: number | null
  frequency: string
  data_source: string | null
  calculation_method: string | null
  owner_id: string | null
}

export interface KpiReadingLike {
  reading_date: string
  value: number
  performance_analysis: string | null
}

/** F6 — polarity-aware achievement %, clamped 0-200; null when unscorable. */
export function kpiAchievement(
  kpi: Pick<KpiScoreInput, 'polarity' | 'target'>,
  readings: KpiReadingLike[],
): number | null {
  if (kpi.target == null || readings.length === 0) return null
  const latest = [...readings].sort((a, b) =>
    b.reading_date.localeCompare(a.reading_date),
  )[0]
  const higherIsBetter = kpi.polarity !== 'lower_is_better'
  const numerator = higherIsBetter ? latest.value : kpi.target
  const denominator = higherIsBetter ? kpi.target : latest.value
  if (denominator === 0) return null
  const pct = (numerator / denominator) * 100
  return Math.round(Math.min(Math.max(pct, 0), 200))
}

/**
 * F7 — data-quality index: mean of timeliness, completeness, reliability
 * (0-100 each). Null with no readings — nothing to grade yet.
 */
export function kpiDataQuality(
  kpi: KpiScoreInput,
  readings: KpiReadingLike[],
  today: string = new Date().toISOString().slice(0, 10),
): number | null {
  if (readings.length === 0) return null

  const perYear = PERIODS_PER_YEAR[kpi.frequency?.toLowerCase() ?? ''] ?? null
  let timeliness = 100
  if (perYear !== null) {
    const first = [...readings]
      .map((r) => r.reading_date)
      .sort((a, b) => a.localeCompare(b))[0]
    const spanDays = Math.max(
      (Date.parse(today) - Date.parse(first)) / 86_400_000,
      0,
    )
    const expected = Math.max(Math.floor((spanDays / 365) * perYear) + 1, 1)
    timeliness = Math.round(Math.min(readings.length / expected, 1) * 100)
  }

  const complete = readings.filter(
    (r) => r.value != null && (r.performance_analysis ?? '').trim() !== '',
  ).length
  const completeness = Math.round((complete / readings.length) * 100)

  const reliabilityParts = [
    (kpi.data_source ?? '').trim() !== '',
    (kpi.calculation_method ?? '').trim() !== '',
    kpi.owner_id != null,
  ].filter(Boolean).length
  const reliability = Math.round((reliabilityParts / 3) * 100)

  return Math.round((timeliness + completeness + reliability) / 3)
}
