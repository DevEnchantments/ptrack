import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  projectsApi,
  registryApi,
  type GlobalMilestone,
  type ProjectListItem,
} from '@/lib/api'
import { usePageTitle } from '@/lib/use-page-title'
import { Input } from '@/components/ui/input'

const DAY = 86_400_000
const LABEL_W = 240
const ROW_H = 44

const parse = (d: string) => Date.parse(`${d}T00:00:00Z`)
const todayUtc = () => {
  const n = new Date()
  return Date.UTC(n.getFullYear(), n.getMonth(), n.getDate())
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/** Bar color pair per status: track (light) + fill (solid), from theme tokens. */
function statusColors(statusName: string | null): { track: string; fill: string } {
  const s = (statusName ?? '').toLowerCase()
  if (s.includes('completed') || s === 'complete')
    return { track: 'var(--status-green-bg)', fill: 'var(--status-green-fg)' }
  if (s.includes('hold'))
    return { track: 'var(--status-amber-bg)', fill: 'var(--status-amber-fg)' }
  if (s.includes('cancel'))
    return { track: 'var(--muted)', fill: 'var(--muted-foreground)' }
  if (s.includes('not started'))
    return { track: 'var(--muted)', fill: 'var(--muted-foreground)' }
  return { track: 'var(--status-blue-bg)', fill: 'var(--status-blue-fg)' }
}

interface Row {
  project: ProjectListItem
  start: number
  end: number
  milestones: GlobalMilestone[]
}

/** Portfolio timeline (Gantt): hand-rolled like the dashboard charts — no
 *  charting library, all colors from theme tokens. Read-only by design:
 *  bars/diamonds navigate, nothing drags. */
export function TimelinePage() {
  usePageTitle('Timeline')
  const navigate = useNavigate()

  const [projects, setProjects] = useState<ProjectListItem[]>([])
  const [milestones, setMilestones] = useState<GlobalMilestone[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [scope, setScope] = useState<'active' | 'completed' | 'all'>('active')

  useEffect(() => {
    Promise.all([projectsApi.list(), registryApi.milestones()])
      .then(([p, m]) => {
        setProjects(p)
        setMilestones(m)
      })
      .catch((e) => setError((e as Error).message))
      .finally(() => setLoading(false))
  }, [])

  const today = todayUtc()

  const { rows, undated } = useMemo(() => {
    const q = search.trim().toLowerCase()
    const byProject = new Map<string, GlobalMilestone[]>()
    for (const m of milestones) {
      if (!m.due_date) continue
      ;(byProject.get(m.project_id) ?? byProject.set(m.project_id, []).get(m.project_id))?.push(m)
    }
    let undatedCount = 0
    const out: Row[] = []
    for (const p of projects) {
      const s = (p.status?.name ?? '').toLowerCase()
      const done = s.includes('completed') || s === 'complete' || s.includes('cancel')
      if (scope === 'active' && done) continue
      if (scope === 'completed' && !done) continue
      if (q && !p.name.toLowerCase().includes(q)) continue
      if (!p.start_date || !p.target_end_date) {
        undatedCount += 1
        continue
      }
      out.push({
        project: p,
        start: parse(p.start_date),
        end: parse(p.actual_end_date ?? p.target_end_date),
        milestones: byProject.get(p.id) ?? [],
      })
    }
    out.sort((a, b) => a.start - b.start)
    return { rows: out, undated: undatedCount }
  }, [projects, milestones, search, scope])

  // Time scale: pad the data range, always include today, month ticks.
  const scale = useMemo(() => {
    if (rows.length === 0) return null
    const min = Math.min(...rows.map((r) => r.start), today) - 15 * DAY
    const max = Math.max(...rows.map((r) => r.end), today) + 30 * DAY
    const spanDays = (max - min) / DAY
    const pxPerDay = spanDays > 550 ? 1.6 : 3.2
    const x = (t: number) => ((t - min) / DAY) * pxPerDay
    const width = x(max)
    const ticks: Array<{ x: number; label: string }> = []
    const d = new Date(min)
    d.setUTCDate(1)
    d.setUTCMonth(d.getUTCMonth() + 1)
    while (d.getTime() < max) {
      const label =
        d.getUTCMonth() === 0 || ticks.length === 0
          ? `${MONTHS[d.getUTCMonth()]} ${String(d.getUTCFullYear()).slice(2)}`
          : MONTHS[d.getUTCMonth()]
      ticks.push({ x: x(d.getTime()), label })
      d.setUTCMonth(d.getUTCMonth() + (pxPerDay < 2 ? 3 : 1))
    }
    return { x, width, ticks }
  }, [rows, today])

  return (
    <div className="mx-auto max-w-6xl p-6">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Portfolio
      </p>
      <h1 className="text-2xl font-semibold">Timeline</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Project spans and milestone due dates on one time axis. Click a bar or
        diamond to open the record.
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Input
          className="h-9 w-64"
          placeholder="Filter by project name…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex items-center gap-1 rounded-md border bg-card p-0.5">
          {(
            [
              ['active', 'Active'],
              ['completed', 'Done'],
              ['all', 'All'],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setScope(value)}
              className={`cursor-pointer rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                scope === value
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <span className="ml-auto flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rotate-45 border-2 border-[var(--status-blue-fg)] bg-card" />
            open
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rotate-45 bg-[var(--status-green-fg)]" />
            done
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rotate-45 bg-destructive" />
            overdue
          </span>
        </span>
      </div>

      {loading ? (
        <div className="mt-6 h-72 animate-pulse rounded-lg border bg-card" />
      ) : error ? (
        <p className="mt-6 text-sm font-medium text-destructive">
          Could not load the timeline: {error}
        </p>
      ) : !scale || rows.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">
          No projects with dates match the current filters.
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-lg border bg-card shadow-xs">
          <div style={{ width: LABEL_W + scale.width, minWidth: '100%' }}>
            {/* Axis */}
            <div
              className="relative border-b"
              style={{ height: 32, marginLeft: LABEL_W }}
            >
              {scale.ticks.map((t) => (
                <span
                  key={t.x}
                  className="absolute top-1.5 -translate-x-1/2 text-[10px] text-muted-foreground"
                  style={{ left: t.x }}
                >
                  {t.label}
                </span>
              ))}
              <span
                className="absolute top-1.5 -translate-x-1/2 rounded bg-primary px-1 text-[10px] font-medium text-primary-foreground"
                style={{ left: scale.x(today) }}
              >
                Today
              </span>
            </div>

            {/* Rows over a shared grid/today layer */}
            <div className="relative">
              <div
                className="pointer-events-none absolute inset-y-0"
                style={{ left: LABEL_W, right: 0 }}
              >
                {scale.ticks.map((t) => (
                  <span
                    key={t.x}
                    className="absolute inset-y-0 w-px bg-border/40"
                    style={{ left: t.x }}
                  />
                ))}
                <span
                  className="absolute inset-y-0 w-px bg-primary"
                  style={{ left: scale.x(today) }}
                />
              </div>

              <ul className="section-list relative">
                {rows.map((r) => {
                  const colors = statusColors(r.project.status?.name ?? null)
                  const left = scale.x(r.start)
                  const width = Math.max(scale.x(r.end) - left, 6)
                  const progress = Math.min(
                    Math.max(r.project.calculated_progress ?? 0, 0),
                    100,
                  )
                  return (
                    <li
                      key={r.project.id}
                      className="flex items-center border-b last:border-b-0"
                      style={{ height: ROW_H }}
                    >
                      <button
                        type="button"
                        onClick={() => navigate(`/projects/${r.project.id}`)}
                        title={r.project.name}
                        className="sticky left-0 z-10 h-full shrink-0 cursor-pointer truncate border-r bg-card px-3 text-left text-sm font-medium hover:text-primary"
                        style={{ width: LABEL_W }}
                      >
                        {r.project.name}
                      </button>
                      <div className="relative h-full flex-1">
                        <button
                          type="button"
                          onClick={() => navigate(`/projects/${r.project.id}`)}
                          aria-label={`${r.project.name}: ${r.project.start_date} to ${r.project.actual_end_date ?? r.project.target_end_date}, ${progress}% complete`}
                          title={`${r.project.start_date} → ${r.project.actual_end_date ?? r.project.target_end_date} · ${progress}%`}
                          className="absolute top-1/2 h-4 -translate-y-1/2 cursor-pointer overflow-hidden rounded-full"
                          style={{ left, width, background: colors.track }}
                        >
                          <span
                            className="absolute inset-y-0 left-0 rounded-full"
                            style={{ width: `${progress}%`, background: colors.fill }}
                          />
                        </button>
                        {r.milestones.map((m) => {
                          const due = parse(m.due_date as string)
                          const done = m.status === 'closed_completed'
                          const overdue = !done && m.status === 'open' && due < today
                          const size = m.is_major ? 13 : 9
                          return (
                            <button
                              key={m.id}
                              type="button"
                              onClick={() =>
                                navigate(
                                  `/projects/${m.project_id}/milestones/${m.id}`,
                                )
                              }
                              aria-label={`Milestone ${m.name}, due ${m.due_date}${done ? ', completed' : overdue ? ', overdue' : ''}`}
                              title={`${m.name} · due ${m.due_date}${done ? ' · completed' : overdue ? ' · overdue' : ''}`}
                              className={`absolute top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rotate-45 cursor-pointer transition-transform hover:scale-125 ${
                                done
                                  ? 'bg-[var(--status-green-fg)]'
                                  : overdue
                                    ? 'bg-destructive'
                                    : 'border-2 border-[var(--status-blue-fg)] bg-card'
                              }`}
                              style={{ left: scale.x(due), width: size, height: size }}
                            />
                          )
                        })}
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        </div>
      )}

      {undated > 0 && (
        <p className="mt-3 text-xs text-muted-foreground">
          {undated} project{undated === 1 ? '' : 's'} without start/end dates
          not shown.
        </p>
      )}
    </div>
  )
}
