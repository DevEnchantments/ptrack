import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { registryApi, type GlobalActionItem } from '@/lib/api'
import { useAuth } from '@/lib/auth-context'
import { usePageTitle } from '@/lib/use-page-title'
import { dueIn } from '@/lib/format'
import { StatusPill } from '@/components/StatusPill'
import { TagChips } from '@/components/TagChips'
import { Input } from '@/components/ui/input'
import { buildCsv, downloadCsv } from '@/lib/csv'
import { ExportCsvDialog } from '@/components/ExportCsvDialog'
import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'

const STATUS_LABELS: Record<string, string> = {
  open: 'Open',
  closed_completed: 'Closed / Completed',
  not_applicable: 'Not Applicable',
}

function isOverdue(a: GlobalActionItem): boolean {
  return (
    a.status === 'open' &&
    Boolean(a.due_date) &&
    (a.due_date as string) < new Date().toISOString().slice(0, 10)
  )
}

function ownerNames(a: GlobalActionItem): string {
  return a.owners
    .sort((x, y) => x.slot - y.slot)
    .map((o) => o.profile?.full_name || o.profile?.email || 'Unknown')
    .join(', ')
}

/** Global action-item register with an assigned-to-me focus toggle. */
export function ActionItemsPage() {
  usePageTitle('Action Items')
  const navigate = useNavigate()
  const { user } = useAuth()

  const [rows, setRows] = useState<GlobalActionItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('open')
  const [mineOnly, setMineOnly] = useState(false)
  const [overdueOnly, setOverdueOnly] = useState(false)

  useEffect(() => {
    registryApi
      .actionItems()
      .then(setRows)
      .catch((e) => setError((e as Error).message))
      .finally(() => setLoading(false))
  }, [])


  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return rows.filter(
      (a) =>
        (status === 'all' || a.status === status) &&
        (!overdueOnly || isOverdue(a)) &&
        (!mineOnly || a.owners.some((o) => o.user_id === user?.id)) &&
        (q === '' ||
          a.title.toLowerCase().includes(q) ||
          (a.project?.name ?? '').toLowerCase().includes(q) ||
          (a.tags ?? []).some((t) => t.toLowerCase().includes(q))),
    )
  }, [rows, search, status, mineOnly, overdueOnly, user?.id])

  const [exportOpen, setExportOpen] = useState(false)
  const exportCsv = () => {
    const csv = buildCsv(
      ['Project', 'Action item', 'Type', 'Owners', 'Due date', 'Status', 'Tags'],
      filtered.map((a) => [
        a.project?.name ?? '', a.title, a.type?.name ?? '',
        (a.owners ?? [])
          .map((o) => o.profile?.full_name ?? o.profile?.email ?? '')
          .filter(Boolean)
          .join('; '),
        a.due_date ?? '', a.status, (a.tags ?? []).join('; '),
      ]),
    )
    downloadCsv(
      `ptrack-action-items-${new Date().toISOString().slice(0, 10)}.csv`,
      csv,
    )
    setExportOpen(false)
  }

  const grouped = useMemo(() => {
    const map = new Map<string, GlobalActionItem[]>()
    for (const a of filtered) {
      const key = a.project?.name ?? 'Unknown project'
      ;(map.get(key) ?? map.set(key, []).get(key))?.push(a)
    }
    return [...map.entries()].sort((x, y) => x[0].localeCompare(y[0]))
  }, [filtered])

  return (
    <div className="mx-auto max-w-5xl p-6">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Portfolio
      </p>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Action Items</h1>
        <Button variant="outline" size="sm" onClick={() => setExportOpen(true)}>
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        Every project's action items in one register.
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Input
          className="h-9 w-64"
          placeholder="Filter by title or project…"
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
            checked={mineOnly}
            onChange={(e) => setMineOnly(e.target.checked)}
          />
          Assigned to me
        </label>
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
          Could not load action items: {error}
        </p>
      ) : filtered.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">
          No action items match the current filters.
        </p>
      ) : (
        <div className="mt-6 flex flex-col gap-5">
          {grouped.map(([projectName, items]) => (
            <section key={projectName}>
              <h2 className="mb-1.5 text-sm font-semibold text-muted-foreground">
                {projectName}
              </h2>
              <ul className="section-list divide-y rounded-md border bg-card">
                {items.map((a) => (
                  <li key={a.id}>
                    <button
                      type="button"
                      onClick={() =>
                        navigate(`/projects/${a.project_id}/action-items/${a.id}`)
                      }
                      className="flex w-full cursor-pointer flex-wrap items-center gap-x-3 gap-y-1 px-4 py-2.5 text-left hover:bg-accent focus-visible:outline-2 focus-visible:outline-ring"
                    >
                      <span className="min-w-0 flex-1 truncate text-sm font-medium">
                        {a.title}
                      </span>
                      <TagChips tags={a.tags} />
                      {a.owners.length > 0 && (
                        <span className="hidden max-w-48 truncate text-xs text-muted-foreground md:inline">
                          {ownerNames(a)}
                        </span>
                      )}
                      {a.due_date && (
                        <span
                          className={`text-xs tabular-nums ${
                            isOverdue(a)
                              ? 'font-medium text-destructive'
                              : 'text-muted-foreground'
                          }`}
                        >
                          Due {a.due_date} · {dueIn(a.due_date)}
                        </span>
                      )}
                      <StatusPill
                        status={a.status}
                        label={STATUS_LABELS[a.status] ?? a.status}
                      />
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
      <ExportCsvDialog
        open={exportOpen}
        onOpenChange={setExportOpen}
        noun="action item"
        count={filtered.length}
        onConfirm={exportCsv}
      />
    </div>
  )
}
