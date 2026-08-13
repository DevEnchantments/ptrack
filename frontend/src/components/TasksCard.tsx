import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, ChevronRight } from 'lucide-react'
import type { ActionItem } from '@/lib/api'

interface Props {
  projectId: string
  actionItems: ActionItem[]
  /** Jump to the Achievement tab where the full list lives. */
  onViewAll: () => void
}

/** Fig 2's Tasks card: the project's action items grouped Upcoming vs
 *  Completed (FR-06), rows clicking through to the action-item page. */
export function TasksCard({ projectId, actionItems, onViewAll }: Props) {
  const navigate = useNavigate()
  const [group, setGroup] = useState<'upcoming' | 'completed'>('upcoming')

  const upcoming = actionItems
    .filter((a) => a.status === 'open')
    .sort((a, b) => (a.due_date ?? '9999').localeCompare(b.due_date ?? '9999'))
  const completed = actionItems
    .filter((a) => a.status === 'closed_completed')
    .sort((a, b) => (b.due_date ?? '').localeCompare(a.due_date ?? ''))
  const shown = group === 'upcoming' ? upcoming : completed
  const today = new Date().toISOString().slice(0, 10)

  return (
    <div className="mt-6 rounded-lg border bg-card p-4 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-semibold">Tasks</h2>
        <div className="flex items-center gap-1 rounded-md border p-0.5">
          {(
            [
              ['upcoming', `Upcoming (${upcoming.length})`],
              ['completed', `Completed (${completed.length})`],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setGroup(value)}
              className={`cursor-pointer rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                group === value
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {shown.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">
          {group === 'upcoming'
            ? 'Nothing upcoming — all action items are done.'
            : 'Nothing completed yet.'}
        </p>
      ) : (
        <ul className="mt-3 max-h-56 divide-y overflow-y-auto rounded-md border">
          {shown.slice(0, 20).map((a) => (
            <li key={a.id}>
              <button
                type="button"
                onClick={() =>
                  navigate(`/projects/${projectId}/action-items/${a.id}`)
                }
                className="flex w-full cursor-pointer items-center gap-2.5 px-3 py-2 text-left hover:bg-accent focus-visible:outline-2 focus-visible:outline-ring"
              >
                {group === 'completed' ? (
                  <Check className="h-4 w-4 shrink-0 text-[var(--status-green-fg)]" />
                ) : (
                  <span className="h-2 w-2 shrink-0 rounded-full border-2 border-[var(--status-blue-fg)]" />
                )}
                <span className="min-w-0 flex-1 truncate text-sm">
                  {a.title}
                </span>
                {a.milestone?.name && (
                  <span className="hidden max-w-40 truncate text-xs text-muted-foreground md:inline">
                    {a.milestone.name}
                  </span>
                )}
                {a.due_date && (
                  <span
                    className={`shrink-0 text-xs tabular-nums ${
                      group === 'upcoming' && a.due_date < today
                        ? 'font-medium text-destructive'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {a.due_date}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        onClick={onViewAll}
        className="mt-3 flex cursor-pointer items-center gap-1 text-xs font-medium text-primary hover:underline"
      >
        View all in Achievement
        <ChevronRight className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}
