# FORMULAS.md — P-Track calculation registry

Convention (2026-07-21): every formula is recorded here before implementation,
with supervisor sign-off.

**Status 2026-08-03: PROVISIONAL.** The supervisor has not responded to the
open questions (OI-02), and Fares directed the build to proceed on standard
assumptions. The formulas below are industry-standard defaults, adopted on
Fares's authority, implemented as documented, and flagged for supervisor
confirmation. If the supervisor specifies different formulas, each has a single
implementation site to change.

| # | Formula | Status |
|---|---|---|
| F1 | Calculated progress | PROVISIONAL 2026-08-03 |
| F2 | Planned progress | PROVISIONAL 2026-08-03 |
| F3 | Risk score + severity | PROVISIONAL 2026-08-03 |
| F4 | At-risk suggestion | PROVISIONAL 2026-08-03 (display-only) |

## F1 — Calculated progress (project)

Weighted average of milestone completion:

```
calculated = round( Σ(weight_i × pct_i) / Σ(weight_i) )
```

- Milestones with status `not_applicable` are excluded.
- `pct_i` = `percent_complete`, clamped 0-100; when null, `closed_completed`
  counts as 100 and anything else as 0.
- If ANY active milestone has a positive `weightage`, weights are used as-is
  (null weight = 0). If NO weights are set, milestones weigh equally.
- No active milestones (or zero total weight) → null (shown as 0% on cards).

Implementation: `backend/src/common/formulas.ts` (list endpoint) and
`frontend/src/lib/formulas.ts` (project page) — intentionally mirrored, both
covered by this definition. Unit tests: `backend/src/common/formulas.spec.ts`.

## F2 — Planned progress (project)

Straight-line time elapsed between start and target end:

```
planned = clamp( (today − start_date) / (target_end_date − start_date) ) × 100
```

- Null when either date is missing or end ≤ start.
- Before start → 0; after end → 100. Rounded to whole percent.

## F3 — Risk score and severity

```
score = probability.sort_order × impact.sort_order
```

With the seeded 1-3 scales this yields 1-9. Severity dot: **red ≥ 6**,
**amber ≥ 3**, **green < 3**. Null when either level is unset. Computed at
display time (`frontend/src/lib/formulas.ts`); nothing stored, so a formula
change is render-only.

## F4 — At-risk suggestion (display-only)

A project *suggests* at-risk when it has at least one overdue open milestone,
or `calculated + 15 < planned`. The stored `projects.at_risk` flag stays
manual; the suggestion never writes it. Surfaced 2026-08-03 on the project
overview Progress card (amber "Suggested: at risk", shown only when the manual
flag is off).

## Explicitly not implemented (await real sign-off)

KPI achievement %, data-quality index (timeliness/completeness/reliability),
budget-threshold trigger values — these are organization-policy numbers, not
standard defaults, and guessing them has real reporting consequences.

## F5 — Initiative delivery buckets (PROVISIONAL, adopted 2026-08-13)

Buckets the executive dashboard's initiative donut (FDD Fig 15) by
`delta = calculated progress (F1) - planned progress (F2)`:

| Bucket | Rule |
|---|---|
| Completed | project status is Completed/Complete/Closed |
| Not Started | status Not Started, or no progress data at all |
| Over-Achieved | delta >= +10 |
| On Target | +10 > delta >= -5 |
| Needs Attention | -5 > delta >= -15 |
| Off Target | -15 > delta >= -30 |
| Severely Off Target | delta < -30 |

Cancelled projects are excluded from the donut. Thresholds are ASSUMED
(standard tolerance bands); adjust on supervisor sign-off. Implementation:
`backend/src/modules/dashboard/dashboard.service.ts`.
