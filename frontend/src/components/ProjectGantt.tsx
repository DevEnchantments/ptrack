import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { gantt } from 'dhtmlx-gantt'
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css'
import type { ActionItem, Milestone, ProgramOutcome } from '@/lib/api'
import { personName } from '@/lib/format'

interface Props {
  projectId: string
  milestones: Milestone[]
  outcomes: ProgramOutcome[]
  actionItems: ActionItem[]
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
export function ProjectGantt({ projectId, milestones, outcomes, actionItems }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const todayLineRef = useRef<HTMLDivElement | null>(null)
  const navigate = useNavigate()
  const [zoom, setZoom] = useState<'Month' | 'Week'>('Month')

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
      isTask?: boolean
      ownerInitials: string
    }
    const rows: Row[] = []
    const today = todayIso()
    const pushMilestone = (m: Milestone, code: string, parent: string | 0) => {
      if (!m.due_date) return
      const ownerName = personName(m.owner, '')
      const statusClass =
        m.status === 'closed_completed'
          ? 'pt-dhx-green'
          : m.due_date < today && m.status === 'open'
            ? 'pt-dhx-red'
            : 'pt-dhx-blue'
      // No start date = a point-in-time checkpoint: the classic Gantt diamond.
      const isDiamond = !m.start_date
      rows.push({
        id: m.id,
        code,
        text: m.name,
        ownerInitials: ownerName
          .split(/\s+/)
          .filter(Boolean)
          .slice(0, 2)
          .map((w) => w[0].toUpperCase())
          .join(''),
        start_date: isDiamond ? m.due_date : (m.start_date as string),
        end_date: isDiamond ? undefined : addDays(m.due_date, 1), // exclusive
        parent,
        progress: Math.min(Math.max(m.percent_complete ?? 0, 0), 100) / 100,
        type: isDiamond ? 'milestone' : undefined,
        open: true,
        statusClass,
        isMilestone: true,
      })
      // Third level: action items (tasks) under their milestone.
      const items = actionItems
        .filter((a) => a.milestone_id === m.id && a.due_date)
        .sort((a, b) => (a.due_date ?? '').localeCompare(b.due_date ?? ''))
      items.forEach((a, k) => {
        const due = a.due_date as string
        rows.push({
          id: `a:${a.id}`,
          code: `${code}.${k + 1}`,
          text: a.title,
          ownerInitials: '',
          start_date: addDays(due, -2),
          end_date: addDays(due, 1),
          parent: m.id,
          progress: a.status === 'closed_completed' ? 1 : 0,
          open: true,
          statusClass:
            a.status === 'closed_completed'
              ? 'pt-dhx-task-done'
              : due < today && a.status === 'open'
                ? 'pt-dhx-red'
                : 'pt-dhx-task',
          isMilestone: false,
          isTask: true,
        })
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
        ownerInitials: '',
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

    // Finish-to-start arrows from milestone_dependencies (informational —
    // readonly gantt, no auto-scheduling).
    const rendered = new Set(rows.map((r) => r.id))
    const links = milestones.flatMap((m) =>
      (m.depends_on ?? [])
        .filter((d) => rendered.has(d.source_id) && rendered.has(m.id))
        .map((d) => ({
          id: `${d.source_id}->${m.id}`,
          source: d.source_id,
          target: m.id,
          type: '0',
        })),
    )

    // --- Configure the singleton (Community edition allows one instance) ---
    gantt.config.readonly = true
    gantt.config.date_format = '%Y-%m-%d'
    gantt.config.open_tree_initially = true
    gantt.config.row_height = 40
    gantt.config.bar_height = 26
    gantt.config.grid_width = 340
    gantt.config.columns = [
      { name: 'code', label: 'ID', width: 56, align: 'left' },
      { name: 'text', label: 'Outcome / Milestone', tree: true, width: 284 },
    ]
    // The whole widget (name grid + timeline) renders at full content width
    // and the card scrolls it as ONE surface — no inner chart-only scroll.
    gantt.config.autosize = 'x'
    if (zoom === 'Week') {
      gantt.config.min_column_width = 26
      gantt.config.scales = [
        { unit: 'month', step: 1, format: '%M %Y' },
        { unit: 'day', step: 1, format: '%d' },
      ]
    } else {
      gantt.config.min_column_width = 64
      gantt.config.scales = [
        { unit: 'year', step: 1, format: '%Y' },
        { unit: 'month', step: 1, format: '%M' },
      ]
    }
    gantt.templates.timeline_cell_class = (_item, date) =>
      zoom === 'Week' && (date.getDay() === 0 || date.getDay() === 6)
        ? 'pt-dhx-weekend'
        : ''
    gantt.templates.task_class = (_s, _e, task) =>
      (task as unknown as { statusClass?: string }).statusClass ?? ''
    // GanttPRO-style labels: short bars carry their name OUTSIDE the bar
    // (no more clipped text); wide bars keep it inside with the owner's
    // initials trailing to the right.
    const barWidth = (s: Date, e: Date) =>
      gantt.posFromDate(e) - gantt.posFromDate(s)
    gantt.templates.task_text = (s, e, task) => {
      const t = task as unknown as {
        text: string
        isMilestone?: boolean
        isTask?: boolean
      }
      if (!t.isMilestone && !t.isTask) return t.text
      return barWidth(s, e) > 110 ? t.text : ''
    }
    gantt.templates.rightside_text = (s, e, task) => {
      const t = task as unknown as {
        text: string
        isMilestone?: boolean
        isTask?: boolean
        ownerInitials?: string
      }
      if (!t.isMilestone && !t.isTask) return ''
      const owner = t.ownerInitials ? ` \u00b7 ${t.ownerInitials}` : ''
      if (barWidth(s, e) > 110) return t.ownerInitials ?? ''
      return `${t.text}${owner}`
    }

    gantt.init(el)
    gantt.parse({ data: rows, links })

    const clickHandler = gantt.attachEvent('onTaskClick', (id: string) => {
      const task = gantt.getTask(id) as unknown as Row
      if (task?.isMilestone) {
        navigate(`/projects/${projectId}/milestones/${id}`)
      } else if (task?.isTask) {
        navigate(
          `/projects/${projectId}/action-items/${String(id).slice(2)}`,
        )
      }
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
  }, [projectId, milestones, outcomes, actionItems, navigate, zoom])

  return (
    <div>
      <div className="mb-2 flex justify-end">
        <div className="flex items-center gap-1 rounded-md border bg-card p-0.5">
          {(['Month', 'Week'] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setZoom(mode)}
              className={`cursor-pointer rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                zoom === mode
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>
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
    </div>
  )
}
