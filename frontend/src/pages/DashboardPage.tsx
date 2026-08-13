import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePageTitle } from '@/lib/use-page-title'
import { dashboardApi, type DashboardData } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

/**
 * My Dashboard — LIVE portfolio aggregates from GET /dashboard.
 *
 * Charts stay hand-rolled inline SVG + CSS transitions (still no charting
 * library). Chart series colors are validated chart-grade tones (CVD-safe,
 * >=3:1 on card), distinct from the UI chrome palette.
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
function smoothPath(pts: Array<{ x: number; y: number }>): string {
  if (pts.length < 2) return ''
  let d = `M ${pts[0].x} ${pts[0].y}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[Math.min(pts.length - 1, i + 2)]
    const c1x = p1.x + (p2.x - p0.x) / 6
    const c1y = p1.y + (p2.y - p0.y) / 6
    const c2x = p2.x - (p3.x - p1.x) / 6
    const c2y = p2.y - (p3.y - p1.y) / 6
    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`
  }
  return d
}

const LINE_W = 640
const LINE_H = 200
const LINE_PAD = { top: 16, right: 16, bottom: 26, left: 34 }

function ActivityLineChart({ data }: { data: ChartPoint[] }) {
  const entered = useEntranceFlag()
  const [hover, setHover] = useState<number | null>(null)

  const max = Math.max(4, Math.ceil(Math.max(...data.map((d) => d.value)) / 4) * 4)
  const innerW = LINE_W - LINE_PAD.left - LINE_PAD.right
  const innerH = LINE_H - LINE_PAD.top - LINE_PAD.bottom
  const pts = data.map((d, i) => ({
    x: LINE_PAD.left + (i / (data.length - 1)) * innerW,
    y: LINE_PAD.top + innerH - (d.value / max) * innerH,
  }))
  const linePath = smoothPath(pts)
  const areaPath = `${linePath} L ${pts[pts.length - 1].x} ${
    LINE_PAD.top + innerH
  } L ${pts[0].x} ${LINE_PAD.top + innerH} Z`
  const gridValues = [0, max / 4, max / 2, (max * 3) / 4, max]

  return (
    <div className="rounded-lg border bg-card p-4 shadow-xs">
      <h2 className="text-sm font-medium">Activity — updates per week</h2>
      <div className="relative mt-2">
        <svg
          viewBox={`0 0 ${LINE_W} ${LINE_H}`}
          className="w-full"
          role="img"
          aria-label="Line chart of updates per week over eight weeks, sample data"
        >
          {gridValues.map((v) => {
            const y = LINE_PAD.top + innerH - (v / max) * innerH
            return (
              <g key={v}>
                <line
                  x1={LINE_PAD.left}
                  x2={LINE_W - LINE_PAD.right}
                  y1={y}
                  y2={y}
                  className="stroke-border"
                  strokeWidth={1}
                />
                <text
                  x={LINE_PAD.left - 8}
                  y={y + 3}
                  textAnchor="end"
                  className="fill-muted-foreground text-[10px]"
                >
                  {v}
                </text>
              </g>
            )
          })}
          {data.map((d, i) => (
            <text
              key={d.label}
              x={pts[i].x}
              y={LINE_H - 8}
              textAnchor="middle"
              className="fill-muted-foreground text-[10px]"
            >
              {d.label}
            </text>
          ))}

          <path
            d={areaPath}
            fill={SERIES.teal}
            className="transition-opacity duration-700"
            style={{ opacity: entered ? 0.12 : 0, transitionDelay: '450ms' }}
          />
          <path
            d={linePath}
            fill="none"
            stroke={SERIES.teal}
            strokeWidth={2}
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray={1}
            style={{
              strokeDashoffset: entered ? 0 : 1,
              transition: 'stroke-dashoffset 900ms ease-out',
            }}
          />

          {hover !== null && (
            <line
              x1={pts[hover].x}
              x2={pts[hover].x}
              y1={LINE_PAD.top}
              y2={LINE_PAD.top + innerH}
              className="stroke-muted-foreground/40"
              strokeWidth={1}
            />
          )}
          {pts.map((p, i) => (
            <g key={i}>
              {(hover === i || i === pts.length - 1) && (
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={4}
                  fill={SERIES.teal}
                  stroke="var(--card)"
                  strokeWidth={2}
                />
              )}
              {/* Oversized invisible hit target per point. */}
              <circle
                cx={p.x}
                cy={p.y}
                r={14}
                fill="transparent"
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
              />
            </g>
          ))}
          {/* Selective direct label: latest point only. */}
          <text
            x={pts[pts.length - 1].x}
            y={pts[pts.length - 1].y - 10}
            textAnchor="middle"
            className="fill-foreground text-[11px] font-medium"
          >
            {data[data.length - 1].value}
          </text>
        </svg>
        {hover !== null && (
          <div
            className="pointer-events-none absolute rounded-md border bg-popover px-2 py-1 text-xs shadow-sm"
            style={{
              left: `${(pts[hover].x / LINE_W) * 100}%`,
              top: 0,
              transform: 'translateX(-50%)',
            }}
          >
            <span className="text-muted-foreground">
              {data[hover].label}:{' '}
            </span>
            <span className="font-medium">{data[hover].value}</span>
          </div>
        )}
      </div>
    </div>
  )
}

function ProjectsBarChart({ data }: { data: ChartPoint[] }) {
  const entered = useEntranceFlag()
  const [hover, setHover] = useState<number | null>(null)
  const max = Math.max(1, ...data.map((d) => d.value))

  return (
    <div className="rounded-lg border bg-card p-4 shadow-xs">
      <h2 className="text-sm font-medium">Projects by status</h2>
      <div className="mt-3 flex flex-col gap-2">
        {data.map((d, i) => (
          <div
            key={d.label}
            className="flex items-center gap-3"
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
          >
            <span className="w-20 shrink-0 text-xs text-muted-foreground">
              {d.label}
            </span>
            <div className="h-4 flex-1">
              <div
                className="h-full rounded-r"
                style={{
                  width: entered ? `${(d.value / max) * 100}%` : '0%',
                  backgroundColor: SERIES.teal,
                  opacity: hover === null || hover === i ? 1 : 0.45,
                  transition: `width 700ms ease-out ${i * 70}ms, opacity 150ms`,
                }}
              />
            </div>
            <span className="w-6 shrink-0 text-right text-xs font-medium tabular-nums">
              {d.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ActionItemsBreakdown({ segments }: { segments: ChartSegment[] }) {
  const entered = useEntranceFlag()
  const total = segments.reduce((s, d) => s + d.value, 0)

  return (
    <div className="rounded-lg border bg-card p-4 shadow-xs">
      <h2 className="text-sm font-medium">Action items</h2>
      {/* 100% stacked bar with 2px surface gaps between segments. */}
      <div className="mt-4 flex h-4 w-full gap-0.5 overflow-hidden rounded">
        {segments.map((d, i) => (
          <div
            key={d.label}
            title={`${d.label}: ${d.value}`}
            style={{
              width: entered ? `${(d.value / total) * 100}%` : '0%',
              backgroundColor: d.color,
              transition: `width 700ms ease-out ${i * 120}ms`,
            }}
          />
        ))}
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
function formatAedShort(n: number): string {
  if (Math.abs(n) >= 1_000_000) return `AED ${(n / 1_000_000).toFixed(2)}M`
  return `AED ${Math.round(n).toLocaleString()}`
}

/** Fig-15 initiative-status donut (buckets per F5, PROVISIONAL). */
function InitiativesDonut({ segments }: { segments: ChartSegment[] }) {
  const entered = useEntranceFlag()
  const total = segments.reduce((sum, d) => sum + d.value, 0)
  const shown = segments.filter((d) => d.value > 0)
  const R = 45
  const C = 2 * Math.PI * R
  const GAP = shown.length > 1 ? 3 : 0
  const fractions = shown.map((d) => (total > 0 ? d.value / total : 0))
  const arcs = shown.map((d, i) => ({
    ...d,
    len: Math.max(fractions[i] * C - GAP, 0),
    offset: fractions.slice(0, i).reduce((sum, f) => sum + f, 0) * C,
  }))
  return (
    <div className="rounded-lg border bg-card p-4 shadow-xs">
      <h2 className="text-sm font-medium">Initiatives</h2>
      <div className="mt-2 flex items-center gap-4">
        <svg
          viewBox="0 0 120 120"
          className="h-32 w-32 shrink-0"
          role="img"
          aria-label={`Donut of ${total} initiatives by delivery bucket`}
        >
          <g transform="rotate(-90 60 60)">
            {arcs.map((a, i) => (
              <circle
                key={a.label}
                cx={60}
                cy={60}
                r={R}
                fill="none"
                stroke={a.color}
                strokeWidth={12}
                strokeDasharray={`${entered ? a.len : 0} ${C}`}
                strokeDashoffset={-a.offset - GAP / 2}
                style={{
                  transition: `stroke-dasharray 800ms ease-out ${i * 120}ms`,
                }}
              />
            ))}
          </g>
          <text
            x="60"
            y="66"
            textAnchor="middle"
            fontSize="22"
            fontWeight="700"
            fill="var(--foreground)"
          >
            {total}
          </text>
        </svg>
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
  const entered = useEntranceFlag()
  const [hover, setHover] = useState<number | null>(null)
  const total = segments.reduce((s, d) => s + d.value, 0)
  const R = 45
  const C = 2 * Math.PI * R
  const GAP = 3
  const fractions = segments.map((d) => d.value / total)
  const arcs = segments.map((d, i) => ({
    ...d,
    len: Math.max(fractions[i] * C - GAP, 0),
    offset: fractions.slice(0, i).reduce((s, f) => s + f, 0) * C,
  }))
  const center = hover !== null ? segments[hover] : null

  return (
    <div className="rounded-lg border bg-card p-4 shadow-xs">
      <h2 className="text-sm font-medium">Projects by category</h2>
      <div className="mt-2 flex items-center gap-4">
        <svg viewBox="0 0 120 120" className="h-32 w-32 shrink-0" role="img"
          aria-label="Donut chart of projects by category, sample data">
          <g transform="rotate(-90 60 60)">
            {arcs.map((a, i) => (
              <circle
                key={a.label}
                cx={60}
                cy={60}
                r={R}
                fill="none"
                stroke={a.color}
                strokeWidth={hover === i ? 14 : 12}
                strokeDasharray={`${entered ? a.len : 0} ${C}`}
                strokeDashoffset={-a.offset - GAP / 2}
                style={{
                  transition: `stroke-dasharray 800ms ease-out ${i * 150}ms, stroke-width 150ms`,
                }}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
              />
            ))}
          </g>
          <text x={60} y={57} textAnchor="middle"
            className="fill-foreground text-xl font-semibold">
            {center ? center.value : total}
          </text>
          <text x={60} y={72} textAnchor="middle"
            className="fill-muted-foreground text-[9px]">
            {center ? center.label : 'projects'}
          </text>
        </svg>
        <ul className="flex flex-1 flex-col gap-2">
          {segments.map((d, i) => (
            <li
              key={d.label}
              className="flex cursor-default items-center gap-2 text-sm"
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
            >
              <span className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: d.color }} />
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
function MilestoneColumns({ data }: { data: ChartPoint[] }) {
  const entered = useEntranceFlag()
  const [hover, setHover] = useState<number | null>(null)
  const max = Math.max(1, ...data.map((d) => d.value))

  return (
    <div className="rounded-lg border bg-card p-4 shadow-xs">
      <h2 className="text-sm font-medium">Milestones completed / month</h2>
      <div className="mt-3 flex h-36 items-end gap-2">
        {data.map((d, i) => (
          <div
            key={d.label}
            className="relative flex h-full flex-1 flex-col justify-end"
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
          >
            {hover === i && (
              <span className="absolute -top-1 left-1/2 -translate-x-1/2 text-xs font-medium">
                {d.value}
              </span>
            )}
            <div
              className="w-full rounded-t"
              style={{
                height: entered ? `${(d.value / max) * 82}%` : '0%',
                backgroundColor: SERIES.teal,
                opacity: hover === null || hover === i ? 1 : 0.45,
                transition: `height 650ms ease-out ${i * 80}ms, opacity 150ms`,
              }}
            />
            <span className="mt-1 text-center text-[10px] text-muted-foreground">
              {d.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

/** Radial progress — a single hero percentage with an animated sweep. */
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
  series: input,
}: {
  labels: string[]
  series: Array<{ label: string; color: string; values: number[] }>
}) {
  const entered = useEntranceFlag()
  const [hover, setHover] = useState<number | null>(null)
  const max = Math.max(4, Math.ceil(Math.max(...input.flatMap((s) => s.values)) / 4) * 4)
  const innerW = LINE_W - LINE_PAD.left - LINE_PAD.right
  const innerH = LINE_H - LINE_PAD.top - LINE_PAD.bottom
  const toPts = (values: number[]) =>
    values.map((v, i) => ({
      x: LINE_PAD.left + (i / (values.length - 1)) * innerW,
      y: LINE_PAD.top + innerH - (v / max) * innerH,
    }))
  const series = input.map((s) => ({ ...s, pts: toPts(s.values) }))
  const gridValues = [0, 1, 2, 3, 4].map((i) => (max / 4) * i)

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
      <div className="relative mt-2">
        <svg viewBox={`0 0 ${LINE_W} ${LINE_H}`} className="w-full" role="img"
          aria-label="Two-series line chart comparing action items created and completed per week, sample data">
          {gridValues.map((v) => {
            const y = LINE_PAD.top + innerH - (v / max) * innerH
            return (
              <g key={v}>
                <line x1={LINE_PAD.left} x2={LINE_W - LINE_PAD.right} y1={y} y2={y}
                  className="stroke-border" strokeWidth={1} />
                <text x={LINE_PAD.left - 8} y={y + 3} textAnchor="end"
                  className="fill-muted-foreground text-[10px]">
                  {v}
                </text>
              </g>
            )
          })}
          {labels.map((w, i) => (
            <text key={w} x={series[0].pts[i].x} y={LINE_H - 8} textAnchor="middle"
              className="fill-muted-foreground text-[10px]">
              {w}
            </text>
          ))}
          {hover !== null && (
            <line
              x1={series[0].pts[hover].x}
              x2={series[0].pts[hover].x}
              y1={LINE_PAD.top}
              y2={LINE_PAD.top + innerH}
              className="stroke-muted-foreground/40"
              strokeWidth={1}
            />
          )}
          {series.map((s, si) => (
            <path
              key={s.label}
              d={smoothPath(s.pts)}
              fill="none"
              stroke={s.color}
              strokeWidth={2}
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray={1}
              style={{
                strokeDashoffset: entered ? 0 : 1,
                transition: `stroke-dashoffset 900ms ease-out ${si * 200}ms`,
              }}
            />
          ))}
          {series.map((s) =>
            hover !== null ? (
              <circle key={s.label} cx={s.pts[hover].x} cy={s.pts[hover].y} r={4}
                fill={s.color} stroke="var(--card)" strokeWidth={2} />
            ) : null,
          )}
          {/* Shared oversized hit targets, one per week. */}
          {series[0].pts.map((p, i) => (
            <rect
              key={i}
              x={p.x - innerW / labels.length / 2}
              y={LINE_PAD.top}
              width={innerW / labels.length}
              height={innerH}
              fill="transparent"
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
            />
          ))}
          {/* Direct end labels, in ink beside a colored mark. */}
          {series.map((s) => (
            <text
              key={s.label}
              x={s.pts[s.pts.length - 1].x}
              y={s.pts[s.pts.length - 1].y - 10}
              textAnchor="middle"
              className="fill-foreground text-[11px] font-medium"
            >
              {s.values[s.values.length - 1]}
            </text>
          ))}
        </svg>
        {hover !== null && (
          <div
            className="pointer-events-none absolute rounded-md border bg-popover px-2 py-1 text-xs shadow-sm"
            style={{
              left: `${(series[0].pts[hover].x / LINE_W) * 100}%`,
              top: 0,
              transform: 'translateX(-50%)',
            }}
          >
            <p className="font-medium">{labels[hover]}</p>
            {series.map((s) => (
              <p key={s.label} className="text-muted-foreground">
                {s.label}:{' '}
                <span className="font-medium text-foreground">{s.values[hover]}</span>
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// Sequential single-hue ramp for the heatmap — theme tokens so the ramp flips
// with dark mode (both variants monotonic in lightness).
const HEAT_RAMP = [1, 2, 3, 4, 5].map((i) => `var(--heat-${i})`)
const HEAT_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']

/** Activity heatmap — sequential ramp with a Less→More scale legend. */
function ActivityHeatmap({ cells }: { cells: number[][] }) {
  const entered = useEntranceFlag()
  const [hover, setHover] = useState<{ w: number; d: number } | null>(null)

  return (
    <div className="rounded-lg border bg-card p-4 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-medium">Team activity — last 12 weeks</h2>
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
          Less
          {HEAT_RAMP.map((c) => (
            <span key={c} className="h-2.5 w-2.5 rounded-[3px]"
              style={{ backgroundColor: c }} />
          ))}
          More
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        <div className="flex flex-col justify-between py-0.5">
          {HEAT_DAYS.map((d) => (
            <span key={d} className="text-[9px] leading-4 text-muted-foreground">{d}</span>
          ))}
        </div>
        <div className="grid flex-1 grid-flow-col gap-1"
          style={{ gridTemplateRows: `repeat(${HEAT_DAYS.length}, 1fr)` }}>
          {cells.map((week, w) =>
            week.map((level, d) => (
              <div
                key={`${w}-${d}`}
                className="aspect-square w-full rounded-[3px]"
                style={{
                  backgroundColor: HEAT_RAMP[level],
                  opacity: entered ? 1 : 0,
                  outline:
                    hover?.w === w && hover?.d === d
                      ? '2px solid var(--ring)'
                      : 'none',
                  transition: `opacity 400ms ease-out ${(w * HEAT_DAYS.length + d) * 8}ms`,
                }}
                onMouseEnter={() => setHover({ w, d })}
                onMouseLeave={() => setHover(null)}
              />
            )),
          )}
        </div>
      </div>
      <p className="mt-2 h-4 text-xs text-muted-foreground">
        {hover
          ? `Week ${hover.w + 1}, ${HEAT_DAYS[hover.d]} — ${cells[hover.w][hover.d]} updates`
          : ' '}
      </p>
    </div>
  )
}

export function DashboardPage() {
  usePageTitle('My Dashboard')
  const navigate = useNavigate()
  const [data, setData] = useState<DashboardData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    dashboardApi
      .get()
      .then(setData)
      .catch((e: Error) => setError(e.message))
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
  const heatMax = Math.max(1, ...data.heat.flat())
  const heatCells = data.heat.map((week) =>
    week.map((v) => (v === 0 ? 0 : Math.max(1, Math.round((v / heatMax) * 4)))),
  )

  return (
    <div className="p-6">
      <header className="mb-5 flex flex-wrap items-center gap-3">
        <h1 className="text-lg font-semibold">My Dashboard</h1>
        <span className="rounded-full border border-status-green-border bg-status-green-bg px-2.5 py-0.5 text-xs font-medium text-status-green-fg">
          Live data
        </span>
      </header>

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
        <ProjectsBarChart data={data.projects_by_status} />
      </div>

      <div className="mt-4 grid grid-cols-1 items-start gap-4 md:grid-cols-2 xl:grid-cols-4">
        <ActionItemsBreakdown segments={actionSegments} />
        <CategoryDonut segments={categorySegments} />
        <MilestoneColumns data={data.milestones_per_month} />
        <CompletionRadial
          done={data.overall_milestones.done}
          total={data.overall_milestones.total}
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <FlowLineChart labels={data.flow.labels} series={flowSeries} />
        <ActivityHeatmap cells={heatCells} />
      </div>
    </div>
  )
}
