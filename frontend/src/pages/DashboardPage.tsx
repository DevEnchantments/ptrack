import { useEffect, useRef, useState, type ReactNode } from 'react'
import { usePageTitle } from '@/lib/use-page-title'

/**
 * My Dashboard — PREVIEW with sample data.
 *
 * Dummy charts only: hand-rolled inline SVG + CSS transitions, deliberately no
 * charting library (that pick is a Phase 2 decision). Chart series colors are
 * validated chart-grade tones (CVD-safe, ≥3:1 on card), distinct from the UI
 * chrome palette.
 *
 * Motion pass (experiment/ui-ux-pro-max): entrances are in-view gated rather
 * than mount-gated, so nothing animates below the fold to an empty room; card
 * chrome, the pointer spotlight and the shared easing live in index.css.
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
  { label: 'Active Projects', value: 24, note: '+2 this month', alert: false },
  { label: 'Open Action Items', value: 37, note: '12 due this week', alert: false },
  { label: 'Milestones This Month', value: 9, note: '3 major', alert: false },
  { label: 'Overdue Items', value: 5, note: '2 escalated', alert: true },
]

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function canHover(): boolean {
  return window.matchMedia('(hover: hover) and (pointer: fine)').matches
}

/**
 * Entrance flag driven by an IntersectionObserver rather than mount, so a
 * chart's reveal plays when it is actually on screen. One-shot. Starts already
 * entered under reduced motion, which also keeps the initial state out of an
 * effect (the set-state-in-effect rule bans that shape).
 */
function useInViewEntrance() {
  const ref = useRef<HTMLDivElement | null>(null)
  const [entered, setEntered] = useState(() => prefersReducedMotion())
  useEffect(() => {
    if (prefersReducedMotion()) return
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setEntered(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  return { ref, entered }
}

/** rAF count-up (duration 0 on reduced motion — first frame lands on target). */
function useCountUp(target: number, run: boolean, durationMs = 900): number {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!run) return
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
  }, [target, durationMs, run])
  return value
}

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

/**
 * Digit wheel. Each column holds 0-9 in a 1em window and translates to its
 * digit, staggered right-to-left like a fuel pump. The wheels are aria-hidden
 * behind a plain readout, or a screen reader would announce "0123456789".
 */
function Odometer({ value, run }: { value: number; run: boolean }) {
  const [rolled, setRolled] = useState(() => prefersReducedMotion())
  useEffect(() => {
    if (!run || prefersReducedMotion()) return
    const raf = requestAnimationFrame(() =>
      requestAnimationFrame(() => setRolled(true)),
    )
    return () => cancelAnimationFrame(raf)
  }, [run])

  const digits = String(value).split('')
  return (
    <span className="inline-flex">
      <span className="sr-only">{value}</span>
      {digits.map((d, i) => (
        <span
          key={i}
          aria-hidden
          className="inline-block h-[1em] overflow-hidden leading-[1em]"
        >
          <span
            className="flex flex-col"
            style={{
              transform: `translateY(-${rolled ? Number(d) : 0}em)`,
              transition: prefersReducedMotion()
                ? 'none'
                : `transform 760ms var(--ease-spring) ${(digits.length - 1 - i) * 70}ms`,
            }}
          >
            {DIGITS.map((n) => (
              <span key={n} className="h-[1em] leading-[1em]">
                {n}
              </span>
            ))}
          </span>
        </span>
      ))}
    </span>
  )
}

function StatTile({
  label,
  value,
  note,
  alert,
  index,
}: {
  label: string
  value: number
  note: string
  alert: boolean
  index: number
}) {
  const { ref, entered } = useInViewEntrance()
  return (
    <div
      ref={ref}
      data-entered={entered}
      className="dash-card"
      style={{ transitionDelay: `${index * 60}ms` }}
    >
      <div
        onMouseMove={(e) => {
          if (!canHover() || prefersReducedMotion()) return
          const r = e.currentTarget.getBoundingClientRect()
          const dx = e.clientX - r.left - r.width / 2
          const dy = e.clientY - r.top - r.height / 2
          e.currentTarget.style.transform = `perspective(600px) rotateX(${
            -(dy / r.height) * 6
          }deg) rotateY(${(dx / r.width) * 6}deg)`
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = ''
        }}
        className={`tile-tilt flex h-full flex-col rounded-lg border bg-card p-4 shadow-xs ${
          alert ? 'tile-alert' : ''
        }`}
      >
        <p className="text-sm text-muted-foreground">{label}</p>
        {/* mt-auto pins the value + note to the bottom, so a label that wraps
            to two lines in a narrow column does not shove them out of line
            with its neighbours. */}
        <p className="mt-auto pt-1 text-3xl font-semibold tabular-nums">
          <Odometer value={value} run={entered} />
        </p>
        <p className="mt-1 text-xs text-muted-foreground">{note}</p>
      </div>
    </div>
  )
}

/**
 * Card chrome + choreography for one chart. Owns the in-view flag and hands it
 * to the chart via a render prop, so a chart's internals only start once its
 * card is on screen. The mousemove writes --mx/--my for the CSS spotlight.
 */
function ChartCard({
  index,
  children,
}: {
  index: number
  children: (entered: boolean) => ReactNode
}) {
  const { ref, entered } = useInViewEntrance()
  return (
    <div
      ref={ref}
      data-entered={entered}
      onMouseMove={(e) => {
        if (!canHover()) return
        const r = e.currentTarget.getBoundingClientRect()
        e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
        e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
      }}
      style={{ transitionDelay: `${index * 60}ms` }}
      className="dash-card chart-card flex h-full flex-col rounded-lg border bg-card p-4 shadow-xs"
    >
      {children(entered)}
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

/**
 * A short bright dash that races the length of the path once as the line
 * draws, then fades. Both source paths already carry pathLength={1}, so the
 * dash maths stay in 0-1 space.
 */
function CometTracer({
  d,
  color,
  entered,
  delayMs = 0,
}: {
  d: string
  color: string
  entered: boolean
  delayMs?: number
}) {
  if (prefersReducedMotion()) return null
  return (
    <path
      d={d}
      fill="none"
      stroke={color}
      strokeWidth={3}
      strokeLinecap="round"
      pathLength={1}
      strokeDasharray="0.05 1"
      style={{
        strokeDashoffset: entered ? -1 : 0,
        opacity: entered ? 0 : 1,
        filter: `drop-shadow(0 0 4px ${color})`,
        transition: `stroke-dashoffset 1100ms var(--ease-out) ${delayMs}ms, opacity 300ms linear ${delayMs + 850}ms`,
      }}
    />
  )
}

function ActivityLineChart({ entered }: { entered: boolean }) {
  const [hover, setHover] = useState<number | null>(null)
  const reduced = prefersReducedMotion()

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

  // Direct label tracks the scrubbed point, falling back to the latest.
  const labelIdx = hover ?? pts.length - 1

  return (
    <>
      <h2 className="text-sm font-medium">Activity — updates per week</h2>
      {/* flex-1, not a centring wrapper: the tooltip is absolute against this
          box, so the SVG has to stay pinned to its top edge. */}
      <div className="relative mt-2 flex-1">
        <svg
          viewBox={`0 0 ${LINE_W} ${LINE_H}`}
          className="w-full"
          role="img"
          aria-label="Line chart of updates per week over eight weeks, sample data"
        >
          <defs>
            {/* Single-series chart, so a drifting gradient costs no colour
                coding. The two-series chart below keeps flat strokes. */}
            <linearGradient id="activity-stroke" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={SERIES.teal} />
              <stop offset="50%" stopColor={SERIES.blue} />
              <stop offset="100%" stopColor={SERIES.teal} />
              {!reduced && (
                <animateTransform
                  attributeName="gradientTransform"
                  type="translate"
                  values="-1 0; 1 0; -1 0"
                  dur="7s"
                  repeatCount="indefinite"
                />
              )}
            </linearGradient>
          </defs>

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
            className="chart-draw"
            d={linePath}
            fill="none"
            stroke="url(#activity-stroke)"
            strokeWidth={2}
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray={1}
            style={{
              strokeDashoffset: entered ? 0 : 1,
              transition: 'stroke-dashoffset 900ms var(--ease-out)',
            }}
          />
          <CometTracer d={linePath} color={SERIES.teal} entered={entered} />

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
          {/* Direct label slides to the scrubbed point; the value pops on change. */}
          <g
            style={{
              transform: `translate(${pts[labelIdx].x}px, ${pts[labelIdx].y - 10}px)`,
              transition: 'transform 200ms var(--ease-out)',
            }}
          >
            <text
              key={labelIdx}
              textAnchor="middle"
              className="value-pop fill-foreground text-[11px] font-medium"
            >
              {WEEKLY_ACTIVITY[labelIdx].value}
            </text>
          </g>
        </svg>
        <div
          className="pointer-events-none absolute rounded-md border bg-popover px-2 py-1 text-xs shadow-sm"
          style={{
            left: `${(pts[hover ?? 0].x / LINE_W) * 100}%`,
            top: 0,
            transform: 'translateX(-50%)',
            opacity: hover === null ? 0 : 1,
            transition:
              'left 160ms var(--ease-out), opacity 130ms var(--ease-out)',
          }}
        >
          <span className="text-muted-foreground">
            {WEEKLY_ACTIVITY[hover ?? 0].label}:{' '}
          </span>
          <span className="font-medium">
            {WEEKLY_ACTIVITY[hover ?? 0].value}
          </span>
        </div>
      </div>
    </>
  )
}

function ProjectsBarChart({ entered }: { entered: boolean }) {
  const [hover, setHover] = useState<number | null>(null)
  const max = Math.max(...PROJECTS_BY_STATUS.map((d) => d.value))

  return (
    <>
      <h2 className="text-sm font-medium">Projects by status</h2>
      <div className="mt-3 flex flex-1 flex-col justify-center gap-2">
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
              {/* Width is static and the fill scales into it: transform-only,
                  so the spring overshoot costs no layout. */}
              <div
                className="h-full origin-left rounded-r"
                style={{
                  width: `${(d.value / max) * 100}%`,
                  backgroundColor: SERIES.teal,
                  transform: entered ? 'scaleX(1)' : 'scaleX(0)',
                  opacity: hover === null || hover === i ? 1 : 0.45,
                  transition: `transform 620ms var(--ease-spring) ${i * 70}ms, opacity 150ms`,
                }}
              />
            </div>
            <span className="w-6 shrink-0 text-right text-xs font-medium tabular-nums">
              {d.value}
            </span>
          </div>
        ))}
      </div>
    </>
  )
}

function ActionItemsBreakdown({ entered }: { entered: boolean }) {
  const total = ACTION_ITEM_SEGMENTS.reduce((s, d) => s + d.value, 0)

  return (
    <>
      <h2 className="text-sm font-medium">Action items</h2>
      {/* 100% stacked bar with 2px surface gaps between segments. Plain ease-out
          here, not the spring: neighbouring segments would overlap on overshoot. */}
      <div className="mt-4 flex h-4 w-full gap-0.5 overflow-hidden rounded">
        {ACTION_ITEM_SEGMENTS.map((d, i) => (
          <div
            key={d.label}
            title={`${d.label}: ${d.value}`}
            className="origin-left"
            style={{
              width: `${(d.value / total) * 100}%`,
              backgroundColor: d.color,
              transform: entered ? 'scaleX(1)' : 'scaleX(0)',
              transition: `transform 700ms var(--ease-out) ${i * 120}ms`,
            }}
          />
        ))}
      </div>
      <ul className="mt-4 flex flex-1 flex-col justify-center gap-2">
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
    </>
  )
}

// Segment order keeps chart-2 (orange) and chart-1 apart — the CVD-safe
// adjacency the palette was validated with.
const CATEGORY_SEGMENTS = [
  { label: 'Software', value: 10, color: SERIES.teal },
  { label: 'Infrastructure', value: 8, color: SERIES.blue },
  { label: 'Security', value: 6, color: SERIES.orange },
]

/** Donut with center readout; hovering a segment pops it out and swaps the center. */
function CategoryDonut({ entered }: { entered: boolean }) {
  const [hover, setHover] = useState<number | null>(null)
  const total = CATEGORY_SEGMENTS.reduce((s, d) => s + d.value, 0)
  const R = 45
  const C = 2 * Math.PI * R
  const GAP = 3
  const fractions = CATEGORY_SEGMENTS.map((d) => d.value / total)
  const arcs = CATEGORY_SEGMENTS.map((d, i) => {
    const startFrac = fractions.slice(0, i).reduce((s, f) => s + f, 0)
    // Mid-angle in the same (pre-rotation) space as the dash offsets, so the
    // parent's rotate(-90) carries the offset around with the segment.
    const mid = (startFrac + fractions[i] / 2) * 2 * Math.PI
    return {
      ...d,
      len: Math.max(fractions[i] * C - GAP, 0),
      offset: startFrac * C,
      dx: Math.cos(mid) * 5,
      dy: Math.sin(mid) * 5,
    }
  })
  const center = hover !== null ? CATEGORY_SEGMENTS[hover] : null

  return (
    <>
      <h2 className="text-sm font-medium">Projects by category</h2>
      <div className="mt-2 flex flex-1 items-center gap-4">
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
                  transform:
                    hover === i ? `translate(${a.dx}px, ${a.dy}px)` : 'none',
                  transition: `stroke-dasharray 800ms var(--ease-out) ${i * 150}ms, stroke-width 150ms, transform 220ms var(--ease-spring)`,
                }}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
              />
            ))}
          </g>
          {/* Keyed so the readout pops when it swaps. */}
          <g key={hover ?? 'total'} className="value-pop">
            <text x={60} y={57} textAnchor="middle"
              className="fill-foreground text-xl font-semibold">
              {center ? center.value : total}
            </text>
            <text x={60} y={72} textAnchor="middle"
              className="fill-muted-foreground text-[9px]">
              {center ? center.label : 'projects'}
            </text>
          </g>
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
    </>
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

/** Vertical columns springing up from the baseline, staggered. */
function MilestoneColumns({ entered }: { entered: boolean }) {
  const [hover, setHover] = useState<number | null>(null)
  const max = Math.max(...MILESTONES_PER_MONTH.map((d) => d.value))

  return (
    <>
      <h2 className="text-sm font-medium">Milestones completed / month</h2>
      {/* min-h keeps the old floor; flex-1 lets the columns grow to fill a
          card stretched by a taller sibling in the row. */}
      <div className="mt-3 flex min-h-36 flex-1 items-end gap-2">
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
              className="w-full origin-bottom rounded-t"
              style={{
                height: `${(d.value / max) * 82}%`,
                backgroundColor: SERIES.teal,
                transform: entered ? 'scaleY(1)' : 'scaleY(0)',
                opacity: hover === null || hover === i ? 1 : 0.45,
                transition: `transform 620ms var(--ease-spring) ${i * 80}ms, opacity 150ms`,
              }}
            />
            <span className="mt-1 text-center text-[10px] text-muted-foreground">
              {d.label}
            </span>
          </div>
        ))}
      </div>
    </>
  )
}

/** Radial progress — a single hero percentage with an animated sweep. */
function CompletionRadial({ entered }: { entered: boolean }) {
  const pct = useCountUp(68, entered, 900)
  const R = 45
  const C = 2 * Math.PI * R
  const target = 0.68

  return (
    <>
      <h2 className="text-sm font-medium">Overall milestone completion</h2>
      <div className="mt-2 flex flex-1 items-center justify-center">
        <svg viewBox="0 0 120 120" className="h-32 w-32" role="img"
          aria-label="Radial gauge showing 68 percent overall completion, sample data">
          <circle cx={60} cy={60} r={R} fill="none" strokeWidth={12}
            className="stroke-muted" />
          {/* ease-out, not the spring: an overshoot here drives dashoffset past
              zero and the arc visibly wraps its own start. */}
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
            style={{ transition: 'stroke-dashoffset 900ms var(--ease-out) 150ms' }}
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
    </>
  )
}

const FLOW_WEEKS = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8']
const FLOW_SERIES = [
  { label: 'Created', color: SERIES.teal, values: [8, 12, 10, 15, 11, 17, 14, 19] },
  { label: 'Completed', color: SERIES.blue, values: [5, 7, 9, 10, 12, 12, 15, 16] },
]

/** Two-series comparison line — legend + direct end labels, shared crosshair. */
function FlowLineChart({ entered }: { entered: boolean }) {
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
  const labelIdx = hover ?? FLOW_WEEKS.length - 1

  return (
    <>
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
      <div className="relative mt-2 flex-1">
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
            <g key={s.label}>
              <path
                className="chart-draw"
                d={smoothPath(s.pts)}
                fill="none"
                stroke={s.color}
                strokeWidth={2}
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray={1}
                style={{
                  strokeDashoffset: entered ? 0 : 1,
                  transition: `stroke-dashoffset 900ms var(--ease-out) ${si * 200}ms`,
                }}
              />
              <CometTracer
                d={smoothPath(s.pts)}
                color={s.color}
                entered={entered}
                delayMs={si * 200}
              />
            </g>
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
          {/* Direct end labels track the scrubbed week. */}
          {series.map((s) => (
            <g
              key={s.label}
              style={{
                transform: `translate(${s.pts[labelIdx].x}px, ${s.pts[labelIdx].y - 10}px)`,
                transition: 'transform 200ms var(--ease-out)',
              }}
            >
              <text
                key={labelIdx}
                textAnchor="middle"
                className="value-pop fill-foreground text-[11px] font-medium"
              >
                {s.values[labelIdx]}
              </text>
            </g>
          ))}
        </svg>
        <div
          className="pointer-events-none absolute rounded-md border bg-popover px-2 py-1 text-xs shadow-sm"
          style={{
            left: `${(series[0].pts[hover ?? 0].x / LINE_W) * 100}%`,
            top: 0,
            transform: 'translateX(-50%)',
            opacity: hover === null ? 0 : 1,
            transition:
              'left 160ms var(--ease-out), opacity 130ms var(--ease-out)',
          }}
        >
          <p className="font-medium">{FLOW_WEEKS[hover ?? 0]}</p>
          {series.map((s) => (
            <p key={s.label} className="text-muted-foreground">
              {s.label}:{' '}
              <span className="font-medium text-foreground">
                {s.values[hover ?? 0]}
              </span>
            </p>
          ))}
        </div>
      </div>
    </>
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
function ActivityHeatmap({ entered }: { entered: boolean }) {
  const [hover, setHover] = useState<{ w: number; d: number } | null>(null)

  return (
    <>
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
      {/* No items-center here: the day labels rely on stretching to the grid's
          height for justify-between to line them up with the cell rows. */}
      <div className="mt-3 flex flex-1 gap-2">
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
                  transform: entered ? 'scale(1)' : 'scale(0.6)',
                  outline:
                    hover?.w === w && hover?.d === d
                      ? '2px solid var(--ring)'
                      : 'none',
                  // Radial delay: the grid blooms outward from the first cell
                  // instead of wiping left to right. The 1.6 weights the short
                  // axis so the wavefront reads as a diagonal, not an ellipse.
                  transition: `opacity 500ms var(--ease-out) ${
                    Math.hypot(w, d * 1.6) * 26
                  }ms, transform 500ms var(--ease-spring) ${
                    Math.hypot(w, d * 1.6) * 26
                  }ms`,
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
          : ' '}
      </p>
    </>
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

      <div className="dash-grid grid grid-cols-2 gap-4 lg:grid-cols-4">
        {STAT_TILES.map((t, i) => (
          <StatTile key={t.label} {...t} index={i} />
        ))}
      </div>

      {/* Rows stretch (no items-start): cards in a row share the tallest
          card's height, and each chart body is flex-1 so its content centres
          in the extra space rather than leaving a gap under it. */}
      <div className="dash-grid mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard index={0}>
          {(entered) => <ActivityLineChart entered={entered} />}
        </ChartCard>
        <ChartCard index={1}>
          {(entered) => <ProjectsBarChart entered={entered} />}
        </ChartCard>
      </div>

      <div className="dash-grid mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <ChartCard index={0}>
          {(entered) => <ActionItemsBreakdown entered={entered} />}
        </ChartCard>
        <ChartCard index={1}>
          {(entered) => <CategoryDonut entered={entered} />}
        </ChartCard>
        <ChartCard index={2}>
          {(entered) => <MilestoneColumns entered={entered} />}
        </ChartCard>
        <ChartCard index={3}>
          {(entered) => <CompletionRadial entered={entered} />}
        </ChartCard>
      </div>

      <div className="dash-grid mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard index={0}>
          {(entered) => <FlowLineChart entered={entered} />}
        </ChartCard>
        <ChartCard index={1}>
          {(entered) => <ActivityHeatmap entered={entered} />}
        </ChartCard>
      </div>
    </div>
  )
}
