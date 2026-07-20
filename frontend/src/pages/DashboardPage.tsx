import { useEffect, useState } from 'react'
import { usePageTitle } from '@/lib/use-page-title'

/**
 * My Dashboard — PREVIEW with sample data.
 *
 * Dummy charts only: hand-rolled inline SVG + CSS transitions, deliberately no
 * charting library (that pick is a Phase 2 decision). Chart series colors are
 * validated chart-grade tones (CVD-safe, ≥3:1 on card), distinct from the UI
 * chrome palette.
 */

// Single source of truth: the --chart-* tokens in index.css (validated trio).
const SERIES = {
  teal: 'var(--chart-1)',
  orange: 'var(--chart-2)',
  blue: 'var(--chart-3)',
}

const WEEKLY_ACTIVITY = [
  { label: 'W1', value: 12 },
  { label: 'W2', value: 18 },
  { label: 'W3', value: 9 },
  { label: 'W4', value: 22 },
  { label: 'W5', value: 17 },
  { label: 'W6', value: 28 },
  { label: 'W7', value: 24 },
  { label: 'W8', value: 31 },
]

const PROJECTS_BY_STATUS = [
  { label: 'On Track', value: 11 },
  { label: 'Elevated', value: 6 },
  { label: 'Hot', value: 3 },
  { label: 'Complete', value: 2 },
  { label: 'Dormant', value: 1 },
  { label: 'Unknown', value: 1 },
]

const ACTION_ITEM_SEGMENTS = [
  { label: 'Open', value: 21, color: SERIES.teal },
  { label: 'In review', value: 9, color: SERIES.blue },
  { label: 'Overdue', value: 7, color: SERIES.orange },
]

const STAT_TILES = [
  { label: 'Active Projects', value: 24, note: '+2 this month' },
  { label: 'Open Action Items', value: 37, note: '12 due this week' },
  { label: 'Milestones This Month', value: 9, note: '3 major' },
  { label: 'Overdue Items', value: 5, note: '2 escalated' },
]

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
    <div className="rounded-xl border bg-card p-4">
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

function ActivityLineChart() {
  const entered = useEntranceFlag()
  const [hover, setHover] = useState<number | null>(null)

  const max = 35 // fixed sample-data ceiling → round gridlines at 0/10/20/30
  const innerW = LINE_W - LINE_PAD.left - LINE_PAD.right
  const innerH = LINE_H - LINE_PAD.top - LINE_PAD.bottom
  const pts = WEEKLY_ACTIVITY.map((d, i) => ({
    x: LINE_PAD.left + (i / (WEEKLY_ACTIVITY.length - 1)) * innerW,
    y: LINE_PAD.top + innerH - (d.value / max) * innerH,
  }))
  const linePath = smoothPath(pts)
  const areaPath = `${linePath} L ${pts[pts.length - 1].x} ${
    LINE_PAD.top + innerH
  } L ${pts[0].x} ${LINE_PAD.top + innerH} Z`
  const gridValues = [0, 10, 20, 30]

  return (
    <div className="rounded-xl border bg-card p-4">
      <p className="text-sm font-medium">Activity — updates per week</p>
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
          {WEEKLY_ACTIVITY.map((d, i) => (
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
            {WEEKLY_ACTIVITY[WEEKLY_ACTIVITY.length - 1].value}
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
              {WEEKLY_ACTIVITY[hover].label}:{' '}
            </span>
            <span className="font-medium">{WEEKLY_ACTIVITY[hover].value}</span>
          </div>
        )}
      </div>
    </div>
  )
}

function ProjectsBarChart() {
  const entered = useEntranceFlag()
  const [hover, setHover] = useState<number | null>(null)
  const max = Math.max(...PROJECTS_BY_STATUS.map((d) => d.value))

  return (
    <div className="rounded-xl border bg-card p-4">
      <p className="text-sm font-medium">Projects by status</p>
      <div className="mt-3 flex flex-col gap-2">
        {PROJECTS_BY_STATUS.map((d, i) => (
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

function ActionItemsBreakdown() {
  const entered = useEntranceFlag()
  const total = ACTION_ITEM_SEGMENTS.reduce((s, d) => s + d.value, 0)

  return (
    <div className="rounded-xl border bg-card p-4">
      <p className="text-sm font-medium">Action items</p>
      {/* 100% stacked bar with 2px surface gaps between segments. */}
      <div className="mt-4 flex h-4 w-full gap-0.5 overflow-hidden rounded">
        {ACTION_ITEM_SEGMENTS.map((d, i) => (
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
        {ACTION_ITEM_SEGMENTS.map((d) => (
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
const CATEGORY_SEGMENTS = [
  { label: 'Software', value: 10, color: SERIES.teal },
  { label: 'Infrastructure', value: 8, color: SERIES.blue },
  { label: 'Security', value: 6, color: SERIES.orange },
]

/** Donut with center readout; hovering a segment swaps the center to it. */
function CategoryDonut() {
  const entered = useEntranceFlag()
  const [hover, setHover] = useState<number | null>(null)
  const total = CATEGORY_SEGMENTS.reduce((s, d) => s + d.value, 0)
  const R = 45
  const C = 2 * Math.PI * R
  const GAP = 3
  const fractions = CATEGORY_SEGMENTS.map((d) => d.value / total)
  const arcs = CATEGORY_SEGMENTS.map((d, i) => ({
    ...d,
    len: Math.max(fractions[i] * C - GAP, 0),
    offset: fractions.slice(0, i).reduce((s, f) => s + f, 0) * C,
  }))
  const center = hover !== null ? CATEGORY_SEGMENTS[hover] : null

  return (
    <div className="rounded-xl border bg-card p-4">
      <p className="text-sm font-medium">Projects by category</p>
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
          {CATEGORY_SEGMENTS.map((d, i) => (
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

const MILESTONES_PER_MONTH = [
  { label: 'Feb', value: 4 },
  { label: 'Mar', value: 7 },
  { label: 'Apr', value: 5 },
  { label: 'May', value: 9 },
  { label: 'Jun', value: 6 },
  { label: 'Jul', value: 8 },
]

/** Vertical columns growing from the baseline, staggered. */
function MilestoneColumns() {
  const entered = useEntranceFlag()
  const [hover, setHover] = useState<number | null>(null)
  const max = Math.max(...MILESTONES_PER_MONTH.map((d) => d.value))

  return (
    <div className="rounded-xl border bg-card p-4">
      <p className="text-sm font-medium">Milestones completed / month</p>
      <div className="mt-3 flex h-36 items-end gap-2">
        {MILESTONES_PER_MONTH.map((d, i) => (
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
function CompletionRadial() {
  const entered = useEntranceFlag()
  const pct = useCountUp(68, 900)
  const R = 45
  const C = 2 * Math.PI * R
  const target = 0.68

  return (
    <div className="rounded-xl border bg-card p-4">
      <p className="text-sm font-medium">Overall milestone completion</p>
      <div className="mt-2 flex justify-center">
        <svg viewBox="0 0 120 120" className="h-32 w-32" role="img"
          aria-label="Radial gauge showing 68 percent overall completion, sample data">
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
        41 of 60 milestones closed
      </p>
    </div>
  )
}

const FLOW_WEEKS = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8']
const FLOW_SERIES = [
  { label: 'Created', color: SERIES.teal, values: [8, 12, 10, 15, 11, 17, 14, 19] },
  { label: 'Completed', color: SERIES.blue, values: [5, 7, 9, 10, 12, 12, 15, 16] },
]

/** Two-series comparison line — legend + direct end labels, shared crosshair. */
function FlowLineChart() {
  const entered = useEntranceFlag()
  const [hover, setHover] = useState<number | null>(null)
  const max = 20
  const innerW = LINE_W - LINE_PAD.left - LINE_PAD.right
  const innerH = LINE_H - LINE_PAD.top - LINE_PAD.bottom
  const toPts = (values: number[]) =>
    values.map((v, i) => ({
      x: LINE_PAD.left + (i / (values.length - 1)) * innerW,
      y: LINE_PAD.top + innerH - (v / max) * innerH,
    }))
  const series = FLOW_SERIES.map((s) => ({ ...s, pts: toPts(s.values) }))
  const gridValues = [0, 5, 10, 15, 20]

  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-medium">Action items — created vs completed</p>
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
          {FLOW_WEEKS.map((w, i) => (
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
              x={p.x - innerW / FLOW_WEEKS.length / 2}
              y={LINE_PAD.top}
              width={innerW / FLOW_WEEKS.length}
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
            <p className="font-medium">{FLOW_WEEKS[hover]}</p>
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
const HEAT_WEEKS = 12
// Deterministic pseudo-random sample intensities (0-4).
const HEAT_CELLS = Array.from({ length: HEAT_WEEKS }, (_, w) =>
  Array.from({ length: HEAT_DAYS.length }, (_, d) => {
    const n = Math.sin(w * 12.9898 + d * 78.233) * 43758.5453
    return Math.abs(Math.floor((n - Math.floor(n)) * 5)) % 5
  }),
)

/** Activity heatmap — sequential ramp with a Less→More scale legend. */
function ActivityHeatmap() {
  const entered = useEntranceFlag()
  const [hover, setHover] = useState<{ w: number; d: number } | null>(null)

  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-medium">Team activity — last 12 weeks</p>
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
          {HEAT_CELLS.map((week, w) =>
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
          ? `Week ${hover.w + 1}, ${HEAT_DAYS[hover.d]} — ${HEAT_CELLS[hover.w][hover.d]} updates`
          : ' '}
      </p>
    </div>
  )
}

export function DashboardPage() {
  usePageTitle('My Dashboard')
  return (
    <div className="p-6">
      <header className="mb-5 flex flex-wrap items-center gap-3">
        <h1 className="text-lg font-semibold">My Dashboard</h1>
        <span className="rounded-full border border-(--chart-2)/40 bg-(--chart-2)/10 px-2.5 py-0.5 text-xs font-medium text-(--chart-2)">
          Preview — sample data
        </span>
        <p className="w-full text-sm text-muted-foreground sm:w-auto">
          Real dashboards arrive in Phase 2; these charts illustrate the layout.
        </p>
      </header>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {STAT_TILES.map((t) => (
          <StatTile key={t.label} {...t} />
        ))}
      </div>

      {/* items-start: cards keep their natural height instead of the tallest
          column inflating its neighbor with empty card space. */}
      <div className="mt-4 grid grid-cols-1 items-start gap-4 lg:grid-cols-2">
        <ActivityLineChart />
        <ProjectsBarChart />
      </div>

      <div className="mt-4 grid grid-cols-1 items-start gap-4 md:grid-cols-2 xl:grid-cols-4">
        <ActionItemsBreakdown />
        <CategoryDonut />
        <MilestoneColumns />
        <CompletionRadial />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <FlowLineChart />
        <ActivityHeatmap />
      </div>
    </div>
  )
}
