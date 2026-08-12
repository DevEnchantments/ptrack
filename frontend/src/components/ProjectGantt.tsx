import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { gantt } from 'dhtmlx-gantt'
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css'
import type { Milestone, ProgramOutcome } from '@/lib/api'

interface Props {
  projectId: string
  milestones: Milestone[]
  outcomes: ProgramOutcome[]
}

const todayIso = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const addDays = (dateIso: string, n: number) => {
  const d = new Date(`${dateIso}T00:00:00`)
  d.setDate(d.getDate() + n)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

/** Fig 9 — the full project Gantt on DHTMLX Community (MIT since v10):
 *  outcome parent rows with nested milestones, ID column (1.1 numbering),
 *  progress-filled bars, read-only. The today line is drawn by hand — the
 *  built-in marker is a PRO feature. DHTMLX is framework-agnostic (imperative
 *  singleton on a ref), so there is no React-version coupling. */
export function ProjectGantt({ projectId, milestones, outcomes }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const todayLineRef = useRef<HTMLDivElement | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    // --- Build Fig-2/9 numbering: outcomes 1..n, milestones n.m ---
    const sortedOutcomes = [...outcomes].sort(
      (a, b) => (a.sort_order ?? 999) - (b.sort_order ?? 999),
    )
    const dueSort = (a: Milestone, b: Milestone) =>
      (a.due_date ?? '9999').localeCompare(b.due_date ?? '9999')

    interface Row {
      id: string
      code: string
      text: string
      start_date?: string
      end_date?: string
      parent: string | 0
      progress: number
      type?: string
      open: boolean
      statusClass: string
      isMilestone: boolean
    }
    const rows: Row[] = []
    const today = todayIso()
    const pushMilestone = (m: Milestone, code: string, parent: string | 0) => {
      if (!m.due_date) return
      rows.push({
        id: m.id,
        code,
        text: m.name,
        start_date: m.start_date ?? addDays(m.due_date, -14),
        end_date: addDays(m.due_date, 1), // dhtmlx end date is exclusive
        parent,
        progress: Math.min(Math.max(m.percent_complete ?? 0, 0), 100) / 100,
        open: true,
        statusClass:
          m.status === 'closed_completed'
            ? 'pt-dhx-green'
            : m.due_date < today && m.status === 'open'
              ? 'pt-dhx-red'
              : 'pt-dhx-blue',
        isMilestone: true,
      })
    }

    let counter = 0
    for (const o of sortedOutcomes) {
      const kids = milestones.filter((m) => m.outcome_id === o.id).sort(dueSort)
      if (kids.length === 0) continue
      counter += 1
      rows.push({
        id: `o:${o.id}`,
        code: String(counter),
        text: o.name,
        parent: 0,
        progress: 0,
        type: 'project',
        open: true,
        statusClass: 'pt-dhx-outcome',
        isMilestone: false,
      })
      kids.forEach((m, j) => pushMilestone(m, `${counter}.${j + 1}`, `o:${o.id}`))
    }
    const grouped = new Set(
      sortedOutcomes.map((o) => o.id).filter((id) =>
        milestones.some((m) => m.outcome_id === id),
      ),
    )
    const loose = milestones
      .filter((m) => !m.outcome_id || !grouped.has(m.outcome_id))
      .sort(dueSort)
    loose.forEach((m) => {
      counter += 1
      pushMilestone(m, String(counter), 0)
    })

    if (rows.length === 0) return

    // --- Configure the singleton (Community edition allows one instance) ---
    gantt.config.readonly = true
    gantt.config.date_format = '%Y-%m-%d'
    gantt.config.open_tree_initially = true
    gantt.config.row_height = 34
    gantt.config.bar_height = 18
    gantt.config.grid_width = 340
    gantt.config.scales = [
      { unit: 'year', step: 1, format: '%Y' },
      { unit: 'month', step: 1, format: '%M' },
    ]
    gantt.config.columns = [
      { name: 'code', label: 'ID', width: 56, align: 'left' },
      { name: 'text', label: 'Outcome / Milestone', tree: true, width: 284 },
    ]
    // The whole widget (name grid + timeline) renders at full content width
    // and the card scrolls it as ONE surface — no inner chart-only scroll.
    gantt.config.autosize = 'x'
    gantt.config.min_column_width = 64
    gantt.templates.task_class = (_s, _e, task) =>
      (task as unknown as { statusClass?: string }).statusClass ?? ''

    gantt.init(el)
    gantt.parse({ data: rows })

    const clickHandler = gantt.attachEvent('onTaskClick', (id: string) => {
      const task = gantt.getTask(id) as unknown as Row
      if (task?.isMilestone) navigate(`/projects/${projectId}/milestones/${id}`)
      return true
    })

    // --- Hand-rolled today line (marker ext is PRO) ---
    const positionTodayLine = () => {
      const line = todayLineRef.current
      if (!line) return
      try {
        const now = new Date()
        const state = gantt.getState() as { min_date: Date; max_date: Date }
        if (now < state.min_date || now > state.max_date) {
          line.style.display = 'none'
          return
        }
        const x = gantt.posFromDate(now)
        const timelinePane = el.querySelector('.gantt_task') as HTMLElement | null
        const gridEdge = timelinePane
          ? timelinePane.getBoundingClientRect().left -
            el.getBoundingClientRect().left
          : gantt.config.grid_width
        const left = gridEdge + x
        if (left <= gridEdge) {
          line.style.display = 'none'
          return
        }
        line.style.display = 'block'
        line.style.left = `${left}px`
      } catch {
        line.style.display = 'none'
      }
    }
    positionTodayLine()
    const renderHandler = gantt.attachEvent('onGanttRender', positionTodayLine)

    return () => {
      // Singleton hygiene: never destructor() the global instance — it can't
      // be revived, which breaks StrictMode remounts and tab revisits.
      gantt.detachEvent(clickHandler)
      gantt.detachEvent(renderHandler)
      gantt.clearAll()
    }
  }, [projectId, milestones, outcomes, navigate])

  return (
    <div className="pt-dhx overflow-x-auto rounded-md border">
      <div className="relative" style={{ height: 440, width: 'max-content', minWidth: '100%' }}>
        <div ref={containerRef} style={{ height: 440 }} />
        <div
          ref={todayLineRef}
          className="pointer-events-none absolute bottom-0 top-0 z-10 hidden w-px bg-primary"
          aria-hidden
        />
      </div>
    </div>
  )
}
