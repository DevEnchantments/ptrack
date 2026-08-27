import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePageTitle } from '@/lib/use-page-title'
import {
  dashboardApi,
  usersApi,
  type DashboardData,
  type MyWork,
} from '@/lib/api'
import { dueIn } from '@/lib/format'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { EChart } from '@/components/charts/EChart'
import {
  breakdownOption,
  donutOption,
  heatmapOption,
  lineOption,
} from '@/lib/charts/dashboard-options'
import type { ChartTheme } from '@/lib/charts/theme'

/**
 * My Dashboard — LIVE portfolio aggregates from GET /dashboard.
 *
 * Charts are Apache ECharts via the shared `EChart` host (lazy-loaded, themed
 * from the design tokens, with a screen-reader data list). Stat tiles, budget
 * bar, cycle status, monthly tiles and the completion ring stay plain DOM.
 * Chart series colors are validated chart-grade tones (CVD-safe, >=3:1 on
 * card), distinct from the UI chrome palette.
 */

// Single source of truth: the --chart-* tokens in index.css (validated trio).
const SERIES = {
  teal: 'var(--chart-1)',
  orange: 'var(--chart-2)',
  blue: 'var(--chart-3)',
}

interface ChartPoint {
  label: string
  value: number
}

interface ChartSegment {
  label: string
  value: number
  color: string
}

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** rAF count-up for the stat tiles (duration 0 on reduced motion — first frame lands on target). */
function useCountUp(target: number, durationMs = 900): number {
  const [value, setValue] = useState(0)
  useEffect(() => {
    const duration = prefersReducedMotion() ? 0 : durationMs
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const t = duration === 0 ? 1 : Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setValue(Math.round(target * eased))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, durationMs])
  return value
}

/** Flips true one frame after mount so CSS transitions run (starts true on reduced motion). */
function useEntranceFlag(): boolean {
  const [entered, setEntered] = useState(() => prefersReducedMotion())
  useEffect(() => {
    const raf = requestAnimationFrame(() =>
      requestAnimationFrame(() => setEntered(true)),
    )
    return () => cancelAnimationFrame(raf)
  }, [])
  return entered
}

function StatTile({
  label,
  value,
  note,
}: {
  label: string
  value: number
  note: string
}) {
  const shown = useCountUp(value)
  return (
    <div className="rounded-lg border bg-card p-4 shadow-xs">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-3xl font-semibold tabular-nums">{shown}</p>
      <p className="mt-1 text-xs text-muted-foreground">{note}</p>
    </div>
  )
}

/** Catmull-Rom → cubic bezier, for a smooth single-series line. */
function ActivityLineChart({ data }: { data: ChartPoint[] }) {
  const build = useCallback(
    (t: ChartTheme, a: boolean) =>
      lineOption(
        data.map((d) => d.label),
        [{ label: 'Updates', color: SERIES.teal, values: data.map((d) => d.value), area: true }],
        t,
        a,
      ),
    [data],
  )
  return (
    <div className="rounded-lg border bg-card p-4 shadow-xs">
      <h2 className="text-sm font-medium">Activity — updates per week</h2>
      <div className="mt-2">
        <EChart
          build={build}
          height={200}
          summary={data.map((d) => ({ label: d.label, value: d.value }))}
          summaryTitle="Updates per week"
        />
      </div>
    </div>
  )
}

function ActionItemsBreakdown({ segments }: { segments: ChartSegment[] }) {
  const total = segments.reduce((s, d) => s + d.value, 0)
  const build = useCallback(
    (t: ChartTheme, a: boolean) => breakdownOption(segments, t, a),
    [segments],
  )
  return (
    <div className="rounded-lg border bg-card p-4 shadow-xs">
      <h2 className="text-sm font-medium">Action items</h2>
      <div className="mt-4">
        <EChart build={build} height={24} summary={segments} summaryTitle="Action items" />
      </div>
      <ul className="mt-4 flex flex-col gap-2">
        {segments.map((d) => (
          <li key={d.label} className="flex items-center gap-2 text-sm">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: d.color }}
            />
            <span className="flex-1 text-muted-foreground">{d.label}</span>
            <span className="font-medium tabular-nums">{d.value}</span>
          </li>
        ))}
        <li className="mt-1 flex items-center gap-2 border-t pt-2 text-sm">
          <span className="flex-1 text-muted-foreground">Total</span>
          <span className="font-semibold tabular-nums">{total}</span>
        </li>
      </ul>
    </div>
  )
}

// Segment order keeps chart-2 (orange) and chart-1 apart — the CVD-safe
// adjacency the palette was validated with.
/** Donut with center readout; hovering a segment swaps the center to it. */
/**
 * The signed-in user's open assignments, due-first — the day's starting
 * point, above the portfolio-wide numbers. Renders nothing while empty so
 * the dashboard stays clean for people with no assigned work.
 */
function MyWorkStrip({
  work,
  onOpen,
  onProfile,
}: {
  work: MyWork
  onOpen: (path: string) => void
  onProfile: () => void
}) {
  const today = new Date().toISOString().slice(0, 10)
  const rows = [
    ...work.action_items.map((w) => ({
      key: `a:${w.id}`,
      kind: 'Task',
      text: w.title ?? '',
      meta: w.project?.name ?? '',
      due: w.due_date ?? null,
      path: `/projects/${w.project_id}/action-items/${w.id}`,
    })),
    ...work.milestones.map((w) => ({
      key: `m:${w.id}`,
      kind: 'Milestone',
      text: w.name ?? '',
      meta: w.project?.name ?? '',
      due: w.due_date ?? null,
      path: `/projects/${w.project_id}/milestones/${w.id}`,
    })),
  ].sort((a, b) => (a.due ?? '9999').localeCompare(b.due ?? '9999'))

  if (rows.length === 0) return null

  return (
    <div className="mb-4 rounded-lg border bg-card p-4 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-medium">My work</h2>
        <button
          type="button"
          onClick={onProfile}
          className="cursor-pointer text-xs text-primary hover:underline"
        >
          View all in profile
        </button>
      </div>
      <ul className="mt-2 divide-y rounded-md border">
        {rows.slice(0, 5).map((r) => (
          <li key={r.key}>
            <button
              type="button"
              onClick={() => onOpen(r.path)}
              className="flex w-full cursor-pointer items-center gap-2.5 px-3 py-2 text-left hover:bg-accent"
            >
              <span className="w-16 shrink-0 rounded-full bg-muted px-2 py-0.5 text-center text-xs text-muted-foreground">
                {r.kind}
              </span>
              <span className="min-w-0 flex-1 truncate text-sm">{r.text}</span>
              <span className="hidden max-w-40 truncate text-xs text-muted-foreground md:inline">
                {r.meta}
              </span>
              {r.due && (
                <span
                  className={`shrink-0 text-xs tabular-nums ${
                    r.due < today
                      ? 'font-medium text-destructive'
                      : 'text-muted-foreground'
                  }`}
                >
                  {dueIn(r.due)}
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>
      {rows.length > 5 && (
        <p className="mt-2 text-xs text-muted-foreground">
          {rows.length - 5} more in your profile.
        </p>
      )}
    </div>
  )
}

function formatAedShort(n: number): string {
  if (Math.abs(n) >= 1_000_000) return `AED ${(n / 1_000_000).toFixed(2)}M`
  return `AED ${Math.round(n).toLocaleString()}`
}

/** Fig-15 initiative-status donut (buckets per F5, PROVISIONAL). */
function InitiativesDonut({ segments }: { segments: ChartSegment[] }) {
  const build = useCallback(
    (t: ChartTheme, a: boolean) => donutOption(segments, 'initiatives', t, a),
    [segments],
  )
  return (
    <div className="rounded-lg border bg-card p-4 shadow-xs">
      <h2 className="text-sm font-medium">Initiatives</h2>
      <div className="mt-2 flex items-center gap-4">
        <div className="h-32 w-32 shrink-0">
          <EChart build={build} height={128} summary={segments} summaryTitle="Initiatives by bucket" />
        </div>
        <ul className="grid flex-1 grid-cols-1 gap-1 text-xs">
          {segments.map((d) => (
            <li key={d.label} className="flex items-center gap-1.5">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ background: d.color }}
              />
              <span className="truncate text-muted-foreground">{d.label}</span>
              <span className="ml-auto font-medium tabular-nums">
                {d.value}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

/** Fig-15 budget widget: utilized vs approved across the portfolio. */
function BudgetBar({ approved, utilized }: { approved: number; utilized: number }) {
  const entered = useEntranceFlag()
  const frac = approved > 0 ? Math.min(utilized / approved, 1) : 0
  return (
    <div className="rounded-lg border bg-card p-4 shadow-xs">
      <h2 className="text-sm font-medium">Budget</h2>
      {approved <= 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">
          No approved budgets recorded.
        </p>
      ) : (
        <>
          <p className="mt-2 text-2xl font-semibold">
            {formatAedShort(utilized)}
            <span className="ml-1 text-sm font-normal text-muted-foreground">
              utilized
            </span>
          </p>
          <div
            className="mt-3 h-3 overflow-hidden rounded-full bg-muted"
            role="img"
            aria-label={`${Math.round(frac * 100)}% of ${formatAedShort(approved)} approved budget utilized`}
          >
            <div
              className="h-full rounded-full bg-[var(--gold)] transition-[width] duration-700 ease-out"
              style={{ width: entered ? `${frac * 100}%` : '0%' }}
            />
          </div>
          <div className="mt-2 flex justify-between text-xs text-muted-foreground">
            <span>of {formatAedShort(approved)} approved</span>
            <span>{formatAedShort(Math.max(approved - utilized, 0))} unutilized</span>
          </div>
        </>
      )}
    </div>
  )
}

const SUBMISSION_STYLE: Record<string, { label: string; cls: string }> = {
  review: { label: 'REVIEW', cls: 'bg-[var(--status-blue-bg)] text-[var(--status-blue-fg)]' },
  validated: { label: 'VALIDATE', cls: 'bg-[var(--status-green-bg)] text-[var(--status-green-fg)]' },
  approved: { label: 'APPROVE', cls: 'bg-[var(--status-green-bg)] text-[var(--status-green-fg)]' },
  returned: { label: 'RETURNED', cls: 'bg-[var(--status-amber-bg)] text-[var(--status-amber-fg)]' },
  rejected: { label: 'REJECTED', cls: 'bg-[var(--status-red-bg)] text-[var(--status-red-fg)]' },
  draft: { label: 'DRAFT', cls: 'bg-muted text-muted-foreground' },
}

/** Fig-15 cycle submission status widget; clicks through to the report. */
function CycleStatusWidget({
  segments,
  onOpen,
}: {
  segments: ChartSegment[]
  onOpen: () => void
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex w-full cursor-pointer flex-col rounded-lg border bg-card p-4 text-left shadow-xs transition-[translate,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-2 focus-visible:outline-ring"
    >
      <h2 className="text-sm font-medium">Cycle Submission Status</h2>
      <ul className="mt-2 flex flex-col gap-1.5">
        {segments.map((d) => {
          const style = SUBMISSION_STYLE[d.label] ?? {
            label: d.label.toUpperCase(),
            cls: 'bg-muted text-muted-foreground',
          }
          return (
            <li key={d.label} className="flex items-center gap-2 text-xs">
              <span
                className={`inline-flex min-w-8 justify-center rounded px-1.5 py-0.5 font-semibold tabular-nums ${style.cls}`}
              >
                {d.value}
              </span>
              <span className="text-muted-foreground">{style.label}</span>
            </li>
          )
        })}
      </ul>
    </button>
  )
}

/** Fig-15 monthly breakdown strip: done/due milestones per month. */
function MonthlyBreakdown({
  months,
}: {
  months: Array<{ label: string; done: number; total: number }>
}) {
  const current = new Date().getMonth()
  return (
    <div className="rounded-lg border bg-card p-4 shadow-xs">
      <h2 className="text-sm font-medium">Monthly Breakdown</h2>
      <div className="scrollbar-none mt-3 flex gap-2 overflow-x-auto">
        {months.map((m, i) => (
          <div
            key={m.label}
            className={`flex min-w-16 flex-1 flex-col items-center rounded-md border px-2 py-2 ${
              i === current ? 'border-primary bg-primary/5' : ''
            }`}
          >
            <span className="text-xs text-muted-foreground">{m.label}</span>
            <span className="mt-1 text-sm font-semibold tabular-nums">
              {m.done}/{m.total}
            </span>
          </div>
        ))}
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        Milestones completed / due per month, current year.
      </p>
    </div>
  )
}

function CategoryDonut({ segments }: { segments: ChartSegment[] }) {
  const build = useCallback(
    (t: ChartTheme, a: boolean) => donutOption(segments, 'projects', t, a),
    [segments],
  )
  return (
    <div className="rounded-lg border bg-card p-4 shadow-xs">
      <h2 className="text-sm font-medium">Projects by category</h2>
      <div className="mt-2 flex items-center gap-4">
        <div className="h-32 w-32 shrink-0">
          <EChart build={build} height={128} summary={segments} summaryTitle="Projects by category" />
        </div>
        <ul className="flex flex-1 flex-col gap-2">
          {segments.map((d) => (
            <li key={d.label} className="flex items-center gap-2 text-sm">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: d.color }}
              />
              <span className="flex-1 text-muted-foreground">{d.label}</span>
              <span className="font-medium tabular-nums">{d.value}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

/** Vertical columns growing from the baseline, staggered. */
function CompletionRadial({ done, total }: { done: number; total: number }) {
  const entered = useEntranceFlag()
  const pctTarget = total > 0 ? Math.round((done / total) * 100) : 0
  const pct = useCountUp(pctTarget, 900)
  const R = 45
  const C = 2 * Math.PI * R
  const target = pctTarget / 100

  return (
    <div className="rounded-lg border bg-card p-4 shadow-xs">
      <h2 className="text-sm font-medium">Overall milestone completion</h2>
      <div className="mt-2 flex justify-center">
        <svg viewBox="0 0 120 120" className="h-32 w-32" role="img"
          aria-label={`Radial gauge showing ${pctTarget} percent overall completion`}>
          <circle cx={60} cy={60} r={R} fill="none" strokeWidth={12}
            className="stroke-muted" />
          <circle
            cx={60}
            cy={60}
            r={R}
            fill="none"
            stroke={SERIES.teal}
            strokeWidth={12}
            strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={entered ? C * (1 - target) : C}
            transform="rotate(-90 60 60)"
            style={{ transition: 'stroke-dashoffset 900ms ease-out 150ms' }}
          />
          <text x={60} y={64} textAnchor="middle"
            className="fill-foreground text-2xl font-semibold">
            {pct}%
          </text>
        </svg>
      </div>
      <p className="mt-1 text-center text-xs text-muted-foreground">
        {done} of {total} milestones closed
      </p>
    </div>
  )
}

/** Two-series comparison line — legend + direct end labels, shared crosshair. */
function FlowLineChart({
  labels,
  series,
}: {
  labels: string[]
  series: Array<{ label: string; color: string; values: number[] }>
}) {
  const build = useCallback(
    (t: ChartTheme, a: boolean) => lineOption(labels, series, t, a),
    [labels, series],
  )
  return (
    <div className="rounded-lg border bg-card p-4 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-medium">Action items — created vs completed</h2>
        <ul className="flex items-center gap-4">
          {series.map((s) => (
            <li key={s.label} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: s.color }} />
              {s.label}
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-2">
        <EChart
          build={build}
          height={200}
          summary={labels.map((l, i) => ({
            label: l,
            value: series.map((s) => `${s.label} ${s.values[i]}`).join(', '),
          }))}
          summaryTitle="Action items created vs completed per week"
        />
      </div>
    </div>
  )
}

/** Monday (UTC) of the week containing `d`, matching the backend's bucketing. */
function mondayOf(d: Date): Date {
  const m = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()))
  m.setUTCDate(m.getUTCDate() - ((m.getUTCDay() + 6) % 7))
  return m
}

/** Change-history heatmap: 12 weeks x Mon-Fri, on the single-hue ramp. */
function ActivityHeatmap({ heat }: { heat: number[][] }) {
  const thisMonday = mondayOf(new Date())
  const weekLabels = heat.map((_, i) => {
    const d = new Date(thisMonday)
    d.setUTCDate(d.getUTCDate() - 7 * (heat.length - 1 - i))
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' })
  })
  const total = heat.flat().reduce((s, v) => s + v, 0)
  const labelsKey = weekLabels.join('|')
  const build = useCallback(
    (t: ChartTheme, a: boolean) => heatmapOption(heat, labelsKey.split('|'), t, a),
    [heat, labelsKey],
  )
  return (
    <div className="rounded-lg border bg-card p-4 shadow-xs">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-sm font-medium">Activity heatmap — changes per weekday</h2>
        <span className="text-xs text-muted-foreground">
          {total.toLocaleString()} changes in the last 12 weeks
        </span>
      </div>
      <div className="mt-2">
        <EChart
          build={build}
          height={180}
          summary={heat.map((w, i) => ({ label: `Week of ${weekLabels[i]}`, value: w.join(', ') }))}
          summaryTitle="Changes per weekday, Monday to Friday"
        />
      </div>
    </div>
  )
}


export function DashboardPage() {
  usePageTitle('My Dashboard')
  const navigate = useNavigate()
  const [data, setData] = useState<DashboardData | null>(null)
  const [myWork, setMyWork] = useState<MyWork | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    dashboardApi
      .get()
      .then(setData)
      .catch((e: Error) => setError(e.message))
    // Personal slice — best-effort; the portfolio view stands without it.
    usersApi
      .myWork()
      .then(setMyWork)
      .catch(() => undefined)
  }, [])

  if (error) {
    return (
      <div className="p-6">
        <p className="text-destructive">{error}</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => window.location.reload()}
        >
          Reload
        </Button>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="p-6">
        <Skeleton className="h-7 w-56" />
        <div className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-28 w-full rounded-lg" />
          ))}
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Skeleton className="h-64 w-full rounded-lg" />
          <Skeleton className="h-64 w-full rounded-lg" />
        </div>
      </div>
    )
  }

  const BUCKET_COLORS: Record<string, string> = {
    Completed: 'var(--chart-2)',
    'Over-Achieved': 'var(--chart-1)',
    'On Target': 'var(--status-green-fg)',
    'Needs Attention': 'var(--gold)',
    'Off Target': 'var(--destructive)',
    'Severely Off Target': 'var(--status-red-fg)',
    'Not Started': 'var(--muted-foreground)',
  }
  const initiativeSegments = data.executive.initiative_buckets.map((b) => ({
    ...b,
    color: BUCKET_COLORS[b.label] ?? 'var(--muted-foreground)',
  }))
  const submissionSegments = data.executive.submissions.map((d) => ({
    ...d,
    color: '',
  }))

  const s = data.stats
  const statTiles = [
    {
      label: 'Active Projects',
      value: s.active_projects,
      note: `+${s.projects_created_this_month} this month`,
    },
    {
      label: 'Open Action Items',
      value: s.open_action_items,
      note: `${s.action_items_due_this_week} due this week`,
    },
    {
      label: 'Milestones This Month',
      value: s.milestones_this_month,
      note: `${s.major_milestones_this_month} major`,
    },
    {
      label: 'Overdue Items',
      value: s.overdue_items,
      note: 'milestones and action items',
    },
  ]
  const actionSegments = [
    { label: 'Open', value: data.action_items.open, color: SERIES.teal },
    { label: 'Closed', value: data.action_items.closed, color: SERIES.blue },
    { label: 'Overdue', value: data.action_items.overdue, color: SERIES.orange },
  ]
  const palette = [SERIES.teal, SERIES.blue, SERIES.orange]
  const categorySegments = data.projects_by_category
    .slice(0, 3)
    .map((c, i) => ({ ...c, color: palette[i] }))
  const flowSeries = [
    { label: 'Created', color: SERIES.teal, values: data.flow.created },
    { label: 'Completed', color: SERIES.blue, values: data.flow.completed },
  ]

  return (
    <div className="p-6">
      <header className="mb-5 flex flex-wrap items-center gap-3">
        <h1 className="text-lg font-semibold">My Dashboard</h1>
        <span className="rounded-full border border-status-green-border bg-status-green-bg px-2.5 py-0.5 text-xs font-medium text-status-green-fg">
          Live data
        </span>
      </header>

      {myWork && (
        <MyWorkStrip
          work={myWork}
          onOpen={(path) => navigate(path)}
          onProfile={() => navigate('/profile')}
        />
      )}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statTiles.map((t) => (
          <StatTile key={t.label} {...t} />
        ))}
      </div>

      {/* Fig-15 executive row */}
      <div className="mt-4 grid grid-cols-1 items-start gap-4 lg:grid-cols-3">
        <InitiativesDonut segments={initiativeSegments} />
        <BudgetBar
          approved={data.executive.budget.approved}
          utilized={data.executive.budget.utilized}
        />
        <CycleStatusWidget
          segments={submissionSegments}
          onOpen={() => navigate('/reporting/cycle-status')}
        />
      </div>
      <div className="mt-4">
        <MonthlyBreakdown months={data.executive.monthly} />
      </div>

      {/* items-start: cards keep their natural height instead of the tallest
          column inflating its neighbor with empty card space. */}
      <div className="mt-4 grid grid-cols-1 items-start gap-4 lg:grid-cols-2">
        <ActivityLineChart data={data.updates_per_week} />
        <FlowLineChart labels={data.flow.labels} series={flowSeries} />
      </div>

      <div className="mt-4">
        <ActivityHeatmap heat={data.heat} />
      </div>

      <div className="mt-4 grid grid-cols-1 items-start gap-4 md:grid-cols-3">
        <ActionItemsBreakdown segments={actionSegments} />
        <CategoryDonut segments={categorySegments} />
        <CompletionRadial
          done={data.overall_milestones.done}
          total={data.overall_milestones.total}
        />
      </div>
    </div>
  )
}
