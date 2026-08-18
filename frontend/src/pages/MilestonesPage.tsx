import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { registryApi, type GlobalMilestone } from '@/lib/api'
import { usePageTitle } from '@/lib/use-page-title'
import { dueIn } from '@/lib/format'
import { StatusPill } from '@/components/StatusPill'
import { TagChips } from '@/components/TagChips'
import { Input } from '@/components/ui/input'

const STATUS_LABELS: Record<string, string> = {
  open: 'Open',
  closed_completed: 'Closed / Completed',
  not_applicable: 'Not Applicable',
}

function isOverdue(m: GlobalMilestone): boolean {
  return (
    m.status === 'open' &&
    Boolean(m.due_date) &&
    (m.due_date as string) < new Date().toISOString().slice(0, 10)
  )
}

/** Global milestone register: every project's milestones in one list. */
export function MilestonesPage() {
  usePageTitle('Milestones')
  const navigate = useNavigate()

  const [rows, setRows] = useState<GlobalMilestone[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('open')
  const [overdueOnly, setOverdueOnly] = useState(false)

  useEffect(() => {
    registryApi
      .milestones()
      .then(setRows)
      .catch((e) => setError((e as Error).message))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return rows.filter(
      (m) =>
        (status === 'all' || m.status === status) &&
        (!overdueOnly || isOverdue(m)) &&
        (q === '' ||
          m.name.toLowerCase().includes(q) ||
          (m.project?.name ?? '').toLowerCase().includes(q) ||
          (m.tags ?? []).some((t) => t.toLowerCase().includes(q))),
    )
  }, [rows, search, status, overdueOnly])

  const grouped = useMemo(() => {
    const map = new Map<string, GlobalMilestone[]>()
    for (const m of filtered) {
      const key = m.project?.name ?? 'Unknown project'
      ;(map.get(key) ?? map.set(key, []).get(key))?.push(m)
    }
    return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]))
  }, [filtered])

  return (
    <div className="mx-auto max-w-5xl p-6">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Portfolio
      </p>
      <h1 className="text-2xl font-semibold">Milestones</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Every project's milestones in one register.
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Input
          className="h-9 w-64"
          placeholder="Filter by name or project…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex items-center gap-1 rounded-md border bg-card p-0.5">
          {[
            ['open', 'Open'],
            ['closed_completed', 'Closed'],
            ['all', 'All'],
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setStatus(value)}
              className={`cursor-pointer rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                status === value
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <label className="flex cursor-pointer items-center gap-1.5 text-sm">
          <input
            type="checkbox"
            className="h-4 w-4 accent-primary"
            checked={overdueOnly}
            onChange={(e) => setOverdueOnly(e.target.checked)}
          />
          Overdue only
        </label>
        {!loading && !error && (
          <span className="ml-auto text-xs text-muted-foreground">
            {filtered.length} of {rows.length}
          </span>
        )}
      </div>

      {loading ? (
        <div className="mt-6 flex flex-col gap-2">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-12 animate-pulse rounded-lg border bg-card" />
          ))}
        </div>
      ) : error ? (
        <p className="mt-6 text-sm font-medium text-destructive">
          Could not load milestones: {error}
        </p>
      ) : filtered.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">
          No milestones match the current filters.
        </p>
      ) : (
        <div className="mt-6 flex flex-col gap-5">
          {grouped.map(([projectName, items]) => (
            <section key={projectName}>
              <h2 className="mb-1.5 text-sm font-semibold text-muted-foreground">
                {projectName}
              </h2>
              <ul className="section-list divide-y rounded-md border bg-card">
                {items.map((m) => (
                  <li key={m.id}>
                    <button
                      type="button"
                      onClick={() =>
                        navigate(`/projects/${m.project_id}/milestones/${m.id}`)
                      }
                      className="flex w-full cursor-pointer flex-wrap items-center gap-x-3 gap-y-1 px-4 py-2.5 text-left hover:bg-accent focus-visible:outline-2 focus-visible:outline-ring"
                    >
                      <span className="min-w-0 flex-1 truncate text-sm font-medium">
                        {m.name}
                      </span>
                      <TagChips tags={m.tags} />
                      {m.is_major && (
                        <span className="rounded bg-accent px-1.5 py-0.5 text-xs">
                          Major
                        </span>
                      )}
                      {m.outcome?.name && (
                        <span className="hidden truncate text-xs text-muted-foreground lg:inline">
                          {m.outcome.name}
                        </span>
                      )}
                      {m.due_date && (
                        <span
                          className={`text-xs tabular-nums ${
                            isOverdue(m)
                              ? 'font-medium text-destructive'
                              : 'text-muted-foreground'
                          }`}
                        >
                          Due {m.due_date} · {dueIn(m.due_date)}
                        </span>
                      )}
                      {m.weightage != null && (
                        <span className="text-xs tabular-nums text-muted-foreground">
                          w {m.weightage}
                        </span>
                      )}
                      <StatusPill
                        status={m.status}
                        label={STATUS_LABELS[m.status] ?? m.status}
                      />
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
