import { useMemo } from 'react'
import { ProjectGantt } from '@/components/ProjectGantt'
import type { Milestone, ProgramOutcome, ProjectDetail } from '@/lib/api'

interface Props {
  project: ProjectDetail
  milestones: Milestone[]
  outcomes: ProgramOutcome[]
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function formatAed(n: number): string {
  if (Math.abs(n) >= 1_000_000) return `AED ${(n / 1_000_000).toFixed(2)}M`
  return `AED ${n.toLocaleString()}`
}

/**
 * Milestone share mirroring F1 (docs/FORMULAS.md, PROVISIONAL): explicit
 * weights when any are set, equal shares otherwise; not-applicable excluded.
 */
function milestoneShares(milestones: Milestone[]): Array<{ m: Milestone; share: number }> {
  const usable = milestones.filter((m) => m.status !== 'not_applicable')
  if (usable.length === 0) return []
  const weighted = usable.some((m) => m.weightage != null)
  const total = weighted
    ? usable.reduce((s, m) => s + (m.weightage ?? 0), 0)
    : usable.length
  if (total <= 0) return usable.map((m) => ({ m, share: 0 }))
  return usable.map((m) => ({
    m,
    share: ((weighted ? (m.weightage ?? 0) : 1) / total) * 100,
  }))
}

/** Fig 8/9 — per-project dashboard: planned-vs-actual line, budget donut,
 *  project Gantt. Series are RECONSTRUCTED from milestone dates (no progress
 *  history is stored): actual = weight completed by month, planned = weight
 *  due by month, time-elapsed fallback when dates/weights are missing. */
export function ProjectDashboardTab({ project, milestones, outcomes }: Props) {
  const series = useMemo(() => {
    const start = project.start_date
    const end = project.actual_end_date ?? project.target_end_date
    if (!start || !end || end < start) return null
    const startDate = new Date(`${start}T00:00:00`)
    const endDate = new Date(`${end}T00:00:00`)
    const points: Array<{ label: string; date: Date }> = []
    const cursor = new Date(startDate.getFullYear(), startDate.getMonth(), 1)
    while (points.length < 36) {
      const monthEnd = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0)
      points.push({
        label: `${MONTHS[cursor.getMonth()]}${cursor.getMonth() === 0 || points.length === 0 ? ` ${String(cursor.getFullYear()).slice(2)}` : ''}`,
        date: monthEnd,
      })
      if (monthEnd >= endDate) break
      cursor.setMonth(cursor.getMonth() + 1)
    }
    const shares = milestoneShares(milestones)
    const hasDue = shares.some(({ m }) => m.due_date)
    const spanMs = endDate.getTime() - startDate.getTime()
    const planned = points.map(({ date }) => {
      if (!hasDue) {
        return spanMs <= 0
          ? 100
          : Math.min(100, Math.max(0, ((date.getTime() - startDate.getTime()) / spanMs) * 100))
      }
      return shares.reduce(
        (s, { m, share }) =>
          m.due_date && new Date(`${m.due_date}T00:00:00`) <= date ? s + share : s,
        0,
      )
    })
    const actual = points.map(({ date }) =>
      shares.reduce(
        (s, { m, share }) =>
          m.completed_date && new Date(`${m.completed_date}T00:00:00`) <= date
            ? s + share
            : s,
        0,
      ),
    )
    return { points, planned, actual }
  }, [project, milestones])

  const approved = project.approved_budget
  const utilized = project.utilized_budget ?? 0
  const utilizedFrac =
    approved && approved > 0 ? Math.min(Math.max(utilized / approved, 0), 1) : null
  const R = 52
  const CIRC = 2 * Math.PI * R

  // Line chart geometry.
  const W = 640
  const H = 200
  const PAD = { l: 36, r: 12, t: 12, b: 26 }
  const x = (i: number, n: number) =>
    PAD.l + (n <= 1 ? 0 : (i / (n - 1)) * (W - PAD.l - PAD.r))
  const y = (v: number) => PAD.t + (1 - v / 100) * (H - PAD.t - PAD.b)
  const linePath = (values: number[]) =>
    values.map((v, i) => `${x(i, values.length)},${y(v)}`).join(' ')
  const labelEvery = series ? Math.max(1, Math.ceil(series.points.length / 8)) : 1

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-lg border bg-card p-5 shadow-xs">
          <h2 className="text-sm font-semibold">Planned vs Actual Progress</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Reconstructed from milestone due/completed dates (provisional, per
            docs/FORMULAS.md).
          </p>
          {!series ? (
            <p className="mt-6 text-sm text-muted-foreground">
              Set the project's start and end dates to draw this chart.
            </p>
          ) : (
            <svg
              viewBox={`0 0 ${W} ${H}`}
              className="mt-3 w-full"
              role="img"
              aria-label={`Planned versus actual progress by month; latest planned ${Math.round(series.planned.at(-1) ?? 0)}%, actual ${Math.round(series.actual.at(-1) ?? 0)}%`}
            >
              {[0, 25, 50, 75, 100].map((v) => (
                <g key={v}>
                  <line
                    x1={PAD.l}
                    y1={y(v)}
                    x2={W - PAD.r}
                    y2={y(v)}
                    stroke="var(--border)"
                    strokeOpacity={0.5}
                  />
                  <text
                    x={PAD.l - 6}
                    y={y(v) + 3}
                    textAnchor="end"
                    fontSize="9"
                    fill="var(--muted-foreground)"
                  >
                    {v}%
                  </text>
                </g>
              ))}
              {series.points.map((p, i) =>
                i % labelEvery === 0 ? (
                  <text
                    key={i}
                    x={x(i, series.points.length)}
                    y={H - 8}
                    textAnchor="middle"
                    fontSize="9"
                    fill="var(--muted-foreground)"
                  >
                    {p.label}
                  </text>
                ) : null,
              )}
              <polyline
                points={linePath(series.planned)}
                fill="none"
                stroke="var(--muted-foreground)"
                strokeWidth="1.5"
                strokeDasharray="5 4"
              />
              <polyline
                points={linePath(series.actual)}
                fill="none"
                stroke="var(--chart-2)"
                strokeWidth="2"
              />
              <circle
                cx={x(series.actual.length - 1, series.actual.length)}
                cy={y(series.actual.at(-1) ?? 0)}
                r="3.5"
                fill="var(--chart-2)"
              />
            </svg>
          )}
          {series && (
            <div className="mt-1 flex items-center gap-5 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-0.5 w-5 border-t-2 border-dashed border-muted-foreground" />
                Planned
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-0.5 w-5 bg-[var(--chart-2)]" style={{ height: 2 }} />
                Actual
              </span>
            </div>
          )}
        </div>

        <div className="rounded-lg border bg-card p-5 shadow-xs">
          <h2 className="text-sm font-semibold">Budget Status</h2>
          {utilizedFrac === null ? (
            <p className="mt-6 text-sm text-muted-foreground">
              Set an approved budget to draw this chart.
            </p>
          ) : (
            <>
              <svg
                viewBox="0 0 140 140"
                className="mx-auto mt-3 w-40"
                role="img"
                aria-label={`Budget: ${formatAed(utilized)} utilized of ${formatAed(approved as number)} approved`}
              >
                <circle cx="70" cy="70" r={R} fill="none" stroke="var(--muted)" strokeWidth="14" />
                <circle
                  cx="70"
                  cy="70"
                  r={R}
                  fill="none"
                  stroke="var(--gold)"
                  strokeWidth="14"
                  strokeLinecap="round"
                  strokeDasharray={`${utilizedFrac * CIRC} ${CIRC}`}
                  transform="rotate(-90 70 70)"
                />
                <text
                  x="70"
                  y="66"
                  textAnchor="middle"
                  fontSize="14"
                  fontWeight="700"
                  fill="var(--foreground)"
                >
                  {formatAed(approved as number)}
                </text>
                <text x="70" y="82" textAnchor="middle" fontSize="9" fill="var(--muted-foreground)">
                  approved
                </text>
              </svg>
              <div className="mt-2 flex flex-col gap-1 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[var(--gold)]" />
                  Utilized ({formatAed(utilized)})
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[var(--muted)]" />
                  Unutilized ({formatAed(Math.max((approved as number) - utilized, 0))})
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="rounded-lg border bg-card p-5 shadow-xs">
        <h2 className="text-sm font-semibold">Milestone Roadmap</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Read-only here — reschedule from the portfolio Timeline or the
          milestone dialogs. Click a bar to open the milestone.
        </p>
        {milestones.filter((m) => m.due_date).length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">
            No milestones with due dates yet.
          </p>
        ) : (
          <div className="mt-3">
            <ProjectGantt
              projectId={project.id}
              milestones={milestones}
              outcomes={outcomes}
            />
          </div>
        )}
      </div>
    </div>
  )
}
