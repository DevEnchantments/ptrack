import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Gantt, { type FrappeTask } from 'frappe-gantt'
// Direct file path: the package's exports map hides the css subpath.
import '../../node_modules/frappe-gantt/dist/frappe-gantt.css'
import {
  milestonesApi,
  projectsApi,
  registryApi,
  type GlobalMilestone,
  type ProjectListItem,
} from '@/lib/api'
import { usePageTitle } from '@/lib/use-page-title'
import { toast } from '@/lib/toast'
import { Input } from '@/components/ui/input'

const iso = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate(),
  ).padStart(2, '0')}`

const addDays = (dateIso: string, n: number) => {
  const d = new Date(`${dateIso}T00:00:00`)
  d.setDate(d.getDate() + n)
  return iso(d)
}

function statusClass(statusName: string | null): string {
  const s = (statusName ?? '').toLowerCase()
  if (s.includes('completed') || s === 'complete') return 'pt-green'
  if (s.includes('hold')) return 'pt-amber'
  if (s.includes('cancel') || s.includes('not started')) return 'pt-gray'
  return 'pt-blue'
}

const VIEW_MODES = ['Week', 'Month'] as const

/** Portfolio timeline on frappe-gantt (framework-agnostic SVG — chosen after
 *  SVAR proved React-18-only; no React internals involved, so no version
 *  coupling). Projects are bars, milestones one-day "◆" rows beneath their
 *  project. Dragging WRITES dates through the normal PATCH endpoints;
 *  clicking a bar opens the record. */
export function TimelinePage() {
  usePageTitle('Timeline')
  const navigate = useNavigate()

  const [projects, setProjects] = useState<ProjectListItem[]>([])
  const [milestones, setMilestones] = useState<GlobalMilestone[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [scope, setScope] = useState<'active' | 'completed' | 'all'>('active')
  const [showMilestones, setShowMilestones] = useState(true)
  const [viewMode, setViewMode] = useState<(typeof VIEW_MODES)[number]>('Month')

  const containerRef = useRef<HTMLDivElement | null>(null)
  const ganttRef = useRef<Gantt | null>(null)
  // The chart scrolls inside its own frame — never the page (house rule).
  const frameHeight = Math.max(420, Math.round(window.innerHeight * 0.65))

  useEffect(() => {
    Promise.all([projectsApi.list(), registryApi.milestones()])
      .then(([p, m]) => {
        setProjects(p)
        setMilestones(m)
      })
      .catch((e) => setError((e as Error).message))
      .finally(() => setLoading(false))
  }, [])

  const { tasks, undated, milestoneProject } = useMemo(() => {
    const q = search.trim().toLowerCase()
    const today = iso(new Date())
    const out: FrappeTask[] = []
    const mProject = new Map<string, string>()
    let undatedCount = 0

    const byProject = new Map<string, GlobalMilestone[]>()
    for (const m of milestones) {
      if (!m.due_date) continue
      ;(
        byProject.get(m.project_id) ??
        byProject.set(m.project_id, []).get(m.project_id)
      )?.push(m)
    }

    for (const p of projects) {
      const s = (p.status?.name ?? '').toLowerCase()
      const done =
        s.includes('completed') || s === 'complete' || s.includes('cancel')
      if (scope === 'active' && done) continue
      if (scope === 'completed' && !done) continue
      if (q && !p.name.toLowerCase().includes(q)) continue
      if (!p.start_date || !p.target_end_date) {
        undatedCount += 1
        continue
      }
      out.push({
        id: `p:${p.id}`,
        name: p.name,
        start: p.start_date,
        end: p.actual_end_date ?? p.target_end_date,
        progress: Math.min(Math.max(p.calculated_progress ?? 0, 0), 100),
        custom_class: statusClass(p.status?.name ?? null),
      })
      if (!showMilestones) continue
      for (const m of byProject.get(p.id) ?? []) {
        mProject.set(m.id, p.id)
        const doneMs = m.status === 'closed_completed'
        const overdue = !doneMs && m.status === 'open' && (m.due_date as string) < today
        out.push({
          id: `m:${m.id}`,
          name: `◆ ${m.name}`,
          start: m.due_date as string,
          end: addDays(m.due_date as string, 1),
          progress: 0,
          custom_class: doneMs ? 'pt-ms-done' : overdue ? 'pt-ms-overdue' : 'pt-ms',
        })
      }
    }
    return { tasks: out, undated: undatedCount, milestoneProject: mProject }
  }, [projects, milestones, search, scope, showMilestones])

  // frappe-gantt owns its own DOM: rebuild the chart when inputs change.
  useEffect(() => {
    const el = containerRef.current
    if (!el || tasks.length === 0) return
    el.innerHTML = ''
    ganttRef.current = new Gantt(el, tasks, {
      view_mode: viewMode,
      view_mode_select: false,
      readonly_progress: true,
      container_height: frameHeight,
      on_click: (task: FrappeTask) => {
        const raw = String(task.id)
        if (raw.startsWith('p:')) navigate(`/projects/${raw.slice(2)}`)
        else if (raw.startsWith('m:')) {
          const id = raw.slice(2)
          const projectId = milestoneProject.get(id)
          if (projectId) navigate(`/projects/${projectId}/milestones/${id}`)
        }
      },
      on_date_change: (task: FrappeTask, start: Date, end: Date) => {
        const raw = String(task.id)
        if (raw.startsWith('p:')) {
          projectsApi
            .update(raw.slice(2), {
              start_date: iso(start),
              target_end_date: iso(end),
            })
            .then(() => toast.success('Project dates updated.'))
            .catch((e: Error) => toast.error(e.message))
        } else if (raw.startsWith('m:')) {
          const id = raw.slice(2)
          const projectId = milestoneProject.get(id)
          if (!projectId) return
          milestonesApi
            .update(projectId, id, { due_date: iso(start) })
            .then(() => toast.success('Milestone due date updated.'))
            .catch((e: Error) => toast.error(e.message))
        }
      },
    })
    return () => {
      el.innerHTML = ''
      ganttRef.current = null
    }
    // viewMode changes go through change_view_mode below, not a rebuild.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tasks, navigate, milestoneProject])

  function switchView(mode: (typeof VIEW_MODES)[number]) {
    setViewMode(mode)
    ganttRef.current?.change_view_mode(mode)
  }

  return (
    <div className="mx-auto max-w-6xl p-6">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Portfolio
      </p>
      <h1 className="text-2xl font-semibold">Timeline</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Drag a bar to reschedule (saves immediately); click a bar to open the
        record.
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
        <div className="flex items-center gap-1 rounded-md border bg-card p-0.5">
          {VIEW_MODES.map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => switchView(mode)}
              className={`cursor-pointer rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                viewMode === mode
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
        <label className="flex cursor-pointer items-center gap-1.5 text-sm">
          <input
            type="checkbox"
            className="h-4 w-4 accent-primary"
            checked={showMilestones}
            onChange={(e) => setShowMilestones(e.target.checked)}
          />
          Milestones
        </label>
      </div>

      {loading ? (
        <div className="mt-6 h-96 animate-pulse rounded-lg border bg-card" />
      ) : error ? (
        <p className="mt-6 text-sm font-medium text-destructive">
          Could not load the timeline: {error}
        </p>
      ) : tasks.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">
          No projects with dates match the current filters.
        </p>
      ) : (
        <div className="mt-6 overflow-hidden rounded-lg border bg-card shadow-xs">
          <div
            ref={containerRef}
            className="pt-gantt overflow-y-auto"
            style={{ height: frameHeight, maxHeight: frameHeight }}
          />
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
