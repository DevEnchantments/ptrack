import { useCallback, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  projectsApi,
  milestonesApi,
  actionItemsApi,
  type ProjectDetail,
  type ProjectMemberDetail,
  type Milestone,
  type ActionItem,
} from '@/lib/api'
import { Button } from '@/components/ui/button'
import { AddPersonDialog } from '@/components/AddPersonDialog'
import { AddMilestoneDialog } from '@/components/AddMilestoneDialog'
import { AddActionItemDialog } from '@/components/AddActionItemDialog'

const ACTIONS = [
  'Add Person', 'Add Issue', 'Add Resource', 'Add Milestone',
  'Add Action Item', 'Add Link', 'Attach File', 'Add Update',
  'Add Status Report',
]

const STATUS_LABELS: Record<string, string> = {
  open: 'Open',
  closed_completed: 'Closed / Completed',
  not_applicable: 'Not Applicable',
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  if (value === null || value === undefined || value === '') return null
  return (
    <div className="grid grid-cols-3 gap-4 border-b px-1 py-3 last:border-0">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="col-span-2 text-sm">{value}</dd>
    </div>
  )
}

function memberName(m: ProjectMemberDetail) {
  return m.profile?.full_name || m.profile?.email || m.pending_name || 'Unknown'
}

function ownerName(m: Milestone) {
  return m.owner?.full_name || m.owner?.email || null
}

export function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [project, setProject] = useState<ProjectDetail | null>(null)
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [actionItems, setActionItems] = useState<ActionItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [addPersonOpen, setAddPersonOpen] = useState(false)
  const [addMilestoneOpen, setAddMilestoneOpen] = useState(false)
  const [addActionItemOpen, setAddActionItemOpen] = useState(false)

  const load = useCallback(() => {
    if (!id) return
    projectsApi
      .get(id)
      .then(setProject)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false))
  }, [id])

  const loadMilestones = useCallback(() => {
    if (!id) return
    milestonesApi
      .list(id)
      .then(setMilestones)
      .catch(() => {})
  }, [id])

  const loadActionItems = useCallback(() => {
    if (!id) return
    actionItemsApi
      .list(id)
      .then(setActionItems)
      .catch(() => {})
  }, [id])

  useEffect(() => {
    load()
    loadMilestones()
    loadActionItems()
  }, [load, loadMilestones, loadActionItems])

  if (loading) {
    return <div className="p-6 text-muted-foreground">Loading…</div>
  }
  if (error || !project) {
    return (
      <div className="p-6">
        <p className="text-destructive">{error ?? 'Project not found.'}</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate('/')}>
          Back to projects
        </Button>
      </div>
    )
  }

  const accessLabel =
    project.access_control === 'restricted'
      ? 'Restricted – Only Accessible by Associated People'
      : 'Open'

  const primaryUrlValue = project.primary_url ? (
    <a href={project.primary_url} target="_blank" rel="noreferrer" className="text-primary hover:underline">{project.primary_url}</a>
  ) : null

  const enabledActions = new Set(['Add Person', 'Add Milestone', 'Add Action Item'])

  function onAction(a: string) {
    if (a === 'Add Person') setAddPersonOpen(true)
    else if (a === 'Add Milestone') setAddMilestoneOpen(true)
    else if (a === 'Add Action Item') setAddActionItemOpen(true)
  }

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
        <span className="text-sm">{project.name}</span>
      </header>

      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 p-6 lg:grid-cols-[1fr_260px]">
        <div>
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-semibold">{project.name}</h1>
            <Button variant="outline" size="sm" disabled>
              Edit Project
            </Button>
          </div>

          <dl className="rounded-md border px-4">
            <Field label="Category" value={project.category?.name ?? null} />
            <Field label="Status" value={project.status?.name ?? null} />
            <Field label="Access Control" value={accessLabel} />
            <Field label="Description" value={project.description} />
            <Field label="Goal" value={project.goal} />
            <Field label="Customer" value={project.customer} />
            <Field label="Project Start Date" value={project.start_date} />
            <Field label="Project Size" value={project.size?.name ?? null} />
            <Field
              label="Tags"
              value={project.tags?.length ? project.tags.join(', ') : null}
            />
            <Field label="Primary URL" value={primaryUrlValue} />
            <Field
              label="Created"
              value={new Date(project.created_at).toLocaleDateString()}
            />
            <Field
              label="Last Updated"
              value={new Date(project.updated_at).toLocaleDateString()}
            />
          </dl>

          <h2 className="mb-3 mt-8 text-lg font-semibold">People</h2>
          {project.members.length === 0 ? (
            <p className="text-sm text-muted-foreground">No people assigned.</p>
          ) : (
            <ul className="divide-y rounded-md border">
              {project.members.map((m) => (
                <li
                  key={m.id}
                  className="flex items-center justify-between px-4 py-3"
                >
                  <div>
                    <span className="text-sm font-medium">{memberName(m)}</span>
                    {m.status === 'pending' && (
                      <span className="ml-2 text-xs text-amber-600">(pending)</span>
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {m.role?.name ?? '—'}
                  </span>
                </li>
              ))}
            </ul>
          )}

          <h2 className="mb-3 mt-8 text-lg font-semibold">Milestones</h2>
          {milestones.length === 0 ? (
            <p className="text-sm text-muted-foreground">No milestones yet.</p>
          ) : (
            <ul className="divide-y rounded-md border">
              {milestones.map((m) => (
                <li
                  key={m.id}
                  onClick={() =>
                    navigate(`/projects/${project.id}/milestones/${m.id}`)
                  }
                  className="cursor-pointer px-4 py-3 hover:bg-accent"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{m.name}</span>
                      {m.is_major && (
                        <span className="rounded bg-accent px-1.5 py-0.5 text-xs">
                          Major
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {STATUS_LABELS[m.status] ?? m.status}
                    </span>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-x-4 text-xs text-muted-foreground">
                    {m.due_date && <span>Due {m.due_date}</span>}
                    {ownerName(m) && <span>Owner: {ownerName(m)}</span>}
                    {m.role?.name && <span>Role: {m.role.name}</span>}
                  </div>
                </li>
              ))}
            </ul>
          )}

          <h2 className="mb-3 mt-8 text-lg font-semibold">Action Items</h2>
          {actionItems.length === 0 ? (
            <p className="text-sm text-muted-foreground">No action items yet.</p>
          ) : (
            <ul className="divide-y rounded-md border">
              {actionItems.map((a) => (
                <li
                  key={a.id}
                  onClick={() =>
                    navigate(`/projects/${project.id}/action-items/${a.id}`)
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
                    {a.milestone?.name && <span>Milestone: {a.milestone.name}</span>}
                    {a.owners.length > 0 && (
                      <span>
                        Owners:{' '}
                        {a.owners
                          .slice()
                          .sort((x, y) => x.slot - y.slot)
                          .map(
                            (o) =>
                              o.profile?.full_name || o.profile?.email || '—',
                          )
                          .join(', ')}
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <aside>
          <div className="rounded-md border p-2">
            {ACTIONS.map((a) => {
              const enabled = enabledActions.has(a)
              return (
                <button
                  key={a}
                  disabled={!enabled}
                  onClick={enabled ? () => onAction(a) : undefined}
                  title={enabled ? '' : 'Coming in a later step'}
                  className={
                    'w-full rounded px-3 py-2 text-left text-sm ' +
                    (enabled
                      ? 'hover:bg-accent'
                      : 'text-muted-foreground disabled:cursor-not-allowed')
                  }
                >
                  {a}
                </button>
              )
            })}
          </div>
        </aside>
      </div>

      <AddPersonDialog
        projectId={project.id}
        open={addPersonOpen}
        onOpenChange={setAddPersonOpen}
        onAdded={load}
      />

      <AddMilestoneDialog
        projectId={project.id}
        open={addMilestoneOpen}
        onOpenChange={setAddMilestoneOpen}
        onAdded={loadMilestones}
      />

      <AddActionItemDialog
        projectId={project.id}
        open={addActionItemOpen}
        onOpenChange={setAddActionItemOpen}
        onSaved={loadActionItems}
      />
    </div>
  )
}