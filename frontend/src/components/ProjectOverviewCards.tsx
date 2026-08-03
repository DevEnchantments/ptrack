import { CircleAlert, ShieldAlert, TriangleAlert } from 'lucide-react'
import type { Issue, Milestone, ProjectDetail, Risk } from '@/lib/api'
import { atRiskSuggested } from '@/lib/formulas'
import { Skeleton } from '@/components/ui/skeleton'

interface Props {
  project: ProjectDetail
  milestones: Milestone[]
  issues: Issue[]
  risks: Risk[]
  calcProgress: number | null
  planProgress: number | null
  loading: boolean
}

function fmtAed(n: number): string {
  return `AED ${Number(n).toLocaleString()}`
}

/**
 * Mini status donut. Buckets are states, so the legend (never color alone)
 * carries identity; fills reuse the CVD-validated chart trio with blue
 * separating the green/orange pair; 2px card-colored gaps between segments.
 */
function Donut({
  segments,
}: {
  segments: Array<{ value: number; cls: string; label: string }>
}) {
  const total = segments.reduce((sum, s) => sum + s.value, 0)
  const R = 27
  const C = 2 * Math.PI * R
  const visible = segments.filter((s) => s.value > 0)
  const gap = visible.length > 1 ? 2 : 0
  const arcs: Array<{
    label: string
    cls: string
    value: number
    frac: number
    start: number
  }> = []
  let acc = 0
  for (const s of visible) {
    const frac = s.value / total
    arcs.push({ ...s, frac, start: acc })
    acc += frac
  }
  return (
    <svg viewBox="0 0 72 72" className="h-[72px] w-[72px] shrink-0 -rotate-90">
      <circle
        cx="36"
        cy="36"
        r={R}
        fill="none"
        strokeWidth="10"
        className="stroke-muted"
      />
      {arcs.map((s) => (
        <circle
          key={s.label}
          cx="36"
          cy="36"
          r={R}
          fill="none"
          strokeWidth="10"
          strokeDasharray={`${Math.max(s.frac * C - gap, 0.5)} ${C}`}
          strokeDashoffset={-(s.start * C)}
          className={s.cls}
        >
          <title>{`${s.label}: ${s.value}`}</title>
        </circle>
      ))}
    </svg>
  )
}

/** FR-04/FR-05 overview cards: progress vs plan, milestone donut, budget, open items. */
export function ProjectOverviewCards({
  project,
  milestones,
  issues,
  risks,
  calcProgress,
  planProgress,
  loading,
}: Props) {
  if (loading) {
    return (
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="rounded-lg border bg-card p-4 shadow-xs">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="mt-3 h-8 w-24" />
            <Skeleton className="mt-3 h-3 w-32" />
          </div>
        ))}
      </div>
    )
  }

  const today = new Date().toISOString().slice(0, 10)
  const active = milestones.filter((m) => m.status !== 'not_applicable')
  const completed = active.filter((m) => m.status === 'closed_completed')
  const overdue = active.filter(
    (m) => m.status === 'open' && m.due_date != null && m.due_date < today,
  )
  const onTarget = active.filter(
    (m) => m.status === 'open' && !overdue.includes(m),
  )
  const openIssues = issues.filter((i) => i.status === 'open').length
  const openRisks = risks.filter((r) => r.status === 'open').length

  const delta =
    calcProgress != null && planProgress != null
      ? calcProgress - planProgress
      : null
  const suggested =
    !project.at_risk && atRiskSuggested(active, calcProgress, planProgress)

  const approved = project.approved_budget
  const utilized = project.utilized_budget
  const utilization =
    approved != null && approved > 0 && utilized != null
      ? Math.round((utilized / approved) * 100)
      : null
  const overBudget =
    approved != null && utilized != null && utilized > approved

  return (
    <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <div className="rounded-lg border bg-card p-4 shadow-xs">
        <h2 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Progress
        </h2>
        <p className="mt-1 text-2xl font-semibold">{calcProgress ?? 0}%</p>
        <div className="mt-2 flex flex-col gap-1 text-xs text-muted-foreground">
          {planProgress != null && (
            <span>
              Planned {planProgress}%
              {delta != null && (
                <span
                  className={`ml-1.5 font-medium ${
                    delta >= 0 ? 'text-status-green-fg' : 'text-status-amber-fg'
                  }`}
                >
                  {delta >= 0 ? '+' : ''}
                  {delta} vs plan
                </span>
              )}
            </span>
          )}
          {project.manual_progress != null && (
            <span>Manual {project.manual_progress}%</span>
          )}
          {project.at_risk && (
            <span className="flex items-center gap-1 font-medium text-destructive">
              <TriangleAlert className="h-3.5 w-3.5" />
              Flagged at risk
            </span>
          )}
          {suggested && (
            <span className="flex items-center gap-1 font-medium text-status-amber-fg">
              <TriangleAlert className="h-3.5 w-3.5" />
              Suggested: at risk
            </span>
          )}
        </div>
      </div>

      <div className="rounded-lg border bg-card p-4 shadow-xs">
        <h2 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Milestones
        </h2>
        {active.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">
            No milestones yet.
          </p>
        ) : (
          <div className="mt-2 flex items-center gap-4">
            <Donut
              segments={[
                {
                  value: completed.length,
                  cls: 'stroke-(--chart-1)',
                  label: 'Completed',
                },
                {
                  value: onTarget.length,
                  cls: 'stroke-(--chart-3)',
                  label: 'On Target',
                },
                {
                  value: overdue.length,
                  cls: 'stroke-(--chart-2)',
                  label: 'Overdue',
                },
              ]}
            />
            <ul className="flex flex-col gap-1 text-xs">
              <li className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-(--chart-1)" />
                Completed
                <span className="ml-auto pl-3 font-medium">
                  {completed.length}
                </span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-(--chart-3)" />
                On Target
                <span className="ml-auto pl-3 font-medium">
                  {onTarget.length}
                </span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-(--chart-2)" />
                Overdue
                <span className="ml-auto pl-3 font-medium">
                  {overdue.length}
                </span>
              </li>
            </ul>
          </div>
        )}
      </div>

      <div className="rounded-lg border bg-card p-4 shadow-xs">
        <h2 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Budget
        </h2>
        {approved == null && utilized == null ? (
          <p className="mt-3 text-sm text-muted-foreground">Not set.</p>
        ) : (
          <>
            <p className="mt-1 text-2xl font-semibold">
              {utilization != null ? `${utilization}%` : '0%'}
            </p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className={`h-full rounded-full ${
                  overBudget ? 'bg-destructive' : 'bg-primary'
                }`}
                style={{
                  width: `${Math.min(Math.max(utilization ?? 0, 0), 100)}%`,
                }}
              />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {utilized != null ? fmtAed(utilized) : 'AED 0'} of{' '}
              {approved != null ? fmtAed(approved) : 'not set'}
            </p>
            {overBudget && (
              <p className="mt-1 flex items-center gap-1 text-xs font-medium text-destructive">
                <CircleAlert className="h-3.5 w-3.5" />
                Over budget
              </p>
            )}
          </>
        )}
      </div>

      <div className="rounded-lg border bg-card p-4 shadow-xs">
        <h2 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Open Items
        </h2>
        <div className="mt-1 flex items-baseline gap-6">
          <div>
            <p className="text-2xl font-semibold">{openIssues}</p>
            <p className="text-xs text-muted-foreground">
              {openIssues === 1 ? 'issue' : 'issues'}
            </p>
          </div>
          <div>
            <p className="text-2xl font-semibold">{openRisks}</p>
            <p className="text-xs text-muted-foreground">
              {openRisks === 1 ? 'risk' : 'risks'}
            </p>
          </div>
        </div>
        {(openIssues > 0 || openRisks > 0) && (
          <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
            <ShieldAlert className="h-3.5 w-3.5" />
            Tracked in the registers below
          </p>
        )}
      </div>
    </div>
  )
}
