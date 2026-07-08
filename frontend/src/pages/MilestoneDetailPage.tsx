import { useCallback, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  milestonesApi,
  actionItemsApi,
  type MilestoneDetail,
  type ActionItem,
} from '@/lib/api'
import { Button } from '@/components/ui/button'
import { AddMilestoneDialog } from '@/components/AddMilestoneDialog'
import { AddActionItemDialog } from '@/components/AddActionItemDialog'
import { MiniCalendar } from '@/components/MiniCalendar'

const STATUS_LABELS: Record<string, string> = {
  open: 'Open',
  closed_completed: 'Closed / Completed',
  not_applicable: 'Not Applicable',
}

const TABS = [
  'Show All',
  'Description',
  'Milestone Action Items',
  'History',
] as const
type Tab = (typeof TABS)[number]

const WEEKDAYS = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
]
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

function formatLongDate(s: string | null): string | null {
  if (!s) return null
  const [y, m, d] = s.split('-').map(Number)
  if (!y || !m || !d) return s
  const dt = new Date(y, m - 1, d)
  return `${WEEKDAYS[dt.getDay()]}, ${d} ${MONTHS[m - 1]}, ${y}`
}

function relativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime()
  const sec = Math.round(diffMs / 1000)
  if (sec < 60) return 'just now'
  const min = Math.round(sec / 60)
  if (min < 60) return `${min} minute${min === 1 ? '' : 's'} ago`
  const hr = Math.round(min / 60)
  if (hr < 24) return `${hr} hour${hr === 1 ? '' : 's'} ago`
  const day = Math.round(hr / 24)
  if (day < 30) return `${day} day${day === 1 ? '' : 's'} ago`
  const mo = Math.round(day / 30)
  if (mo < 12) return `${mo} month${mo === 1 ? '' : 's'} ago`
  const yr = Math.round(mo / 12)
  return `${yr} year${yr === 1 ? '' : 's'} ago`
}

function profileName(
  p?: { full_name: string | null; email: string | null } | null,
): string {
  return p?.full_name || p?.email || 'Unknown'
}

function ownerLabel(m: MilestoneDetail): string | null {
  const owner = m.owner?.full_name || m.owner?.email || null
  const role = m.role?.name || null
  if (owner && role) return `${role}: ${owner}`
  if (owner) return owner
  if (role) return role
  return null
}

function auditLine(
  iso: string | undefined,
  p?: { full_name: string | null; email: string | null } | null,
): string | null {
  if (!iso) return null
  return `${relativeTime(iso)} by ${profileName(p)}`
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  const empty = value === null || value === undefined || value === ''
  return (
    <div className="grid grid-cols-3 gap-4 border-b px-1 py-3 last:border-0">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="col-span-2 text-sm">{empty ? '-' : value}</dd>
    </div>
  )
}

export function MilestoneDetailPage() {
  const { projectId, milestoneId } = useParams<{
    projectId: string
    milestoneId: string
  }>()
  const navigate = useNavigate()
  const [milestone, setMilestone] = useState<MilestoneDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tab, setTab] = useState<Tab>('Show All')
  const [editOpen, setEditOpen] = useState(false)
  const [actionItems, setActionItems] = useState<ActionItem[]>([])
  const [addAiOpen, setAddAiOpen] = useState(false)

  const load = useCallback(() => {
    if (!projectId || !milestoneId) return
    milestonesApi
      .get(projectId, milestoneId)
      .then(setMilestone)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false))
  }, [projectId, milestoneId])

  const loadActionItems = useCallback(() => {
    if (!projectId || !milestoneId) return
    actionItemsApi
      .list(projectId)
      .then((all) =>
        setActionItems(all.filter((a) => a.milestone_id === milestoneId)),
      )
      .catch(() => {})
  }, [projectId, milestoneId])

  useEffect(() => {
    load()
    loadActionItems()
  }, [load, loadActionItems])

  if (loading) {
    return <div className="p-6 text-muted-foreground">Loading…</div>
  }
  if (error || !milestone) {
    return (
      <div className="p-6">
        <p className="text-destructive">{error ?? 'Milestone not found.'}</p>
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

  const projectName = milestone.project?.name ?? 'Project'
  const showDescription = tab === 'Show All' || tab === 'Description'
  const showActionItems = tab === 'Show All' || tab === 'Milestone Action Items'
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
          {projectName}
        </button>
        <span className="mx-2 text-muted-foreground">/</span>
        <span className="text-sm">Milestone</span>
      </header>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 p-6 lg:grid-cols-[1fr_240px]">
        <div>
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Milestone</h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/projects/${projectId}`)}
            >
              View Project
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditOpen(true)}
            >
              Edit Milestone
            </Button>
          </div>
        </div>

        <dl className="rounded-md border px-4">
          <Field label="Project" value={milestone.project?.name ?? null} />
          <Field label="Milestone" value={milestone.name} />
          <Field label="Start Date" value={formatLongDate(milestone.start_date)} />
          <Field label="Due Date" value={formatLongDate(milestone.due_date)} />
          <Field
            label="Status"
            value={STATUS_LABELS[milestone.status] ?? milestone.status}
          />
          <Field
            label="Tags"
            value={milestone.tags?.length ? milestone.tags.join(', ') : null}
          />
          <Field label="Owner" value={ownerLabel(milestone)} />
          <Field label="Major Milestone" value={milestone.is_major ? 'Yes' : 'No'} />
          <Field label="Weightage" value={milestone.weightage} />
          <Field label="% of Completion" value={milestone.percent_complete} />
          <Field
            label="Created"
            value={auditLine(milestone.created_at, milestone.created_by_profile)}
          />
          <Field
            label="Updated"
            value={auditLine(milestone.updated_at, milestone.updated_by_profile)}
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

        {showDescription && (
          <section className="mt-6">
            <h2 className="mb-3 text-lg font-semibold">Description</h2>
            <div className="rounded-md border p-4 text-sm">
              {milestone.description ? (
                <p className="whitespace-pre-wrap">{milestone.description}</p>
              ) : (
                <p className="text-muted-foreground">No description.</p>
              )}
            </div>
          </section>
        )}

        {showActionItems && (
          <section className="mt-6">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Milestone Action Items</h2>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setAddAiOpen(true)}
                  aria-label="Add action item"
                  title="Add action item"
                  className="rounded px-2 py-1 text-lg leading-none hover:bg-accent"
                >
                  +
                </button>
                <button
                  onClick={() => navigate(`/projects/${projectId}`)}
                  aria-label="View all action items"
                  title="View all action items"
                  className="rounded px-2 py-1 text-lg leading-none hover:bg-accent"
                >
                  ›
                </button>
              </div>
            </div>
            {actionItems.length === 0 ? (
              <div className="rounded-md border p-6 text-sm text-muted-foreground">
                No Data Found.
              </div>
            ) : (
              <ul className="divide-y rounded-md border">
                {actionItems.map((a) => (
                  <li
                    key={a.id}
                    onClick={() =>
                      navigate(`/projects/${projectId}/action-items/${a.id}`)
                    }
                    className="cursor-pointer px-4 py-3 hover:bg-accent"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{a.title}</span>
                      <span className="text-sm text-muted-foreground">
                        {STATUS_LABELS[a.status] ?? a.status}
                      </span>
                    </div>
                    <div className="mt-1 flex flex-wrap gap-x-4 text-xs text-muted-foreground">
                      {a.due_date && <span>Due {a.due_date}</span>}
                      {a.type?.name && <span>Type: {a.type.name}</span>}
                      {a.owners.length > 0 && (
                        <span>
                          Owners:{' '}
                          {a.owners
                            .slice()
                            .sort((x, y) => x.slot - y.slot)
                            .map(
                              (o) =>
                                o.profile?.full_name ||
                                o.profile?.email ||
                                '—',
                            )
                            .join(', ')}
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {showHistory && (
          <section className="mt-6">
            <h2 className="mb-3 text-lg font-semibold">History</h2>
            <div className="rounded-md border p-6 text-sm text-muted-foreground">
              No updates.
            </div>
          </section>
        )}
        </div>

        <aside className="flex flex-col gap-4">
          <MiniCalendar label="Due Date" date={milestone.due_date} />
          <MiniCalendar
            label="Milestone Created"
            date={milestone.created_at}
          />
        </aside>
      </div>

      <AddMilestoneDialog
        projectId={projectId!}
        open={editOpen}
        onOpenChange={setEditOpen}
        existing={milestone}
        onAdded={load}
        onDeleted={() => navigate(`/projects/${projectId}`)}
      />

      <AddActionItemDialog
        projectId={projectId!}
        open={addAiOpen}
        onOpenChange={setAddAiOpen}
        defaultMilestoneId={milestoneId}
        onSaved={loadActionItems}
      />
    </div>
  )
}