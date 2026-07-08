import { useCallback, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { actionItemsApi, type ActionItem } from '@/lib/api'
import { Button } from '@/components/ui/button'

const STATUS_LABELS: Record<string, string> = {
  open: 'Open',
  closed_completed: 'Closed / Completed',
  not_applicable: 'Not Applicable',
}

const TABS = ['Show All', 'Comments', 'History'] as const
type Tab = (typeof TABS)[number]

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  if (value === null || value === undefined || value === '') return null
  return (
    <div className="grid grid-cols-3 gap-4 border-b px-1 py-3 last:border-0">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="col-span-2 text-sm">{value}</dd>
    </div>
  )
}

function ownersLabel(item: ActionItem): string | null {
  if (!item.owners.length) return null
  return item.owners
    .slice()
    .sort((a, b) => a.slot - b.slot)
    .map((o) => o.profile?.full_name || o.profile?.email || '—')
    .join(', ')
}

export function ActionItemDetailPage() {
  const { projectId, actionItemId } = useParams<{
    projectId: string
    actionItemId: string
  }>()
  const navigate = useNavigate()
  const [item, setItem] = useState<ActionItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tab, setTab] = useState<Tab>('Show All')

  const load = useCallback(() => {
    if (!projectId || !actionItemId) return
    actionItemsApi
      .get(projectId, actionItemId)
      .then(setItem)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false))
  }, [projectId, actionItemId])

  useEffect(() => {
    load()
  }, [load])

  if (loading) {
    return <div className="p-6 text-muted-foreground">Loading…</div>
  }
  if (error || !item) {
    return (
      <div className="p-6">
        <p className="text-destructive">{error ?? 'Action item not found.'}</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => navigate(`/projects/${projectId}`)}
        >
          Back to project
        </Button>
      </div>
    )
  }

  const showComments = tab === 'Show All' || tab === 'Comments'
  const showHistory = tab === 'Show All' || tab === 'History'

  return (
    <div className="min-h-svh">
      <header className="border-b px-6 py-4">
        <button
          onClick={() => navigate('/')}
          className="text-sm text-muted-foreground hover:underline"
        >
          Projects
        </button>
        <span className="mx-2 text-muted-foreground">/</span>
        <button
          onClick={() => navigate(`/projects/${projectId}`)}
          className="text-sm text-muted-foreground hover:underline"
        >
          Project
        </button>
        <span className="mx-2 text-muted-foreground">/</span>
        <span className="text-sm">Action Item</span>
      </header>

      <div className="mx-auto max-w-5xl p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Action Item</h1>
          <Button variant="outline" size="sm" disabled>
            Edit Action Item
          </Button>
        </div>

        <dl className="rounded-md border px-4">
          <Field label="Action" value={item.title} />
          <Field label="Milestone" value={item.milestone?.name ?? null} />
          <Field label="Type" value={item.type?.name ?? null} />
          <Field label="Assigned Role" value={item.role?.name ?? null} />
          <Field
            label="Status"
            value={STATUS_LABELS[item.status] ?? item.status}
          />
          <Field label="Due Date" value={item.due_date} />
          <Field label="Owner(s)" value={ownersLabel(item)} />
          <Field label="Description" value={item.description} />
          <Field
            label="Tags"
            value={item.tags?.length ? item.tags.join(', ') : null}
          />
        </dl>

        <div className="mt-6 flex gap-6 border-b">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={
                'border-b-2 pb-2 text-sm ' +
                (tab === t
                  ? 'border-primary font-medium'
                  : 'border-transparent text-muted-foreground hover:text-foreground')
              }
            >
              {t}
            </button>
          ))}
        </div>

        {showComments && (
          <section className="mt-6">
            <h2 className="mb-3 text-lg font-semibold">Comments</h2>
            <div className="rounded-md border p-6 text-sm text-muted-foreground">
              Comments coming in the next step.
            </div>
          </section>
        )}

        {showHistory && (
          <section className="mt-6">
            <h2 className="mb-3 text-lg font-semibold">History</h2>
            <div className="rounded-md border p-6 text-sm text-muted-foreground">
              History coming in a later step.
            </div>
          </section>
        )}
      </div>
    </div>
  )
}