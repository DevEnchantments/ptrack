import { useCallback, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  projectsApi,
  milestonesApi,
  actionItemsApi,
  linksApi,
  resourcesApi,
  type ProjectDetail,
  type ProjectMemberDetail,
  type Milestone,
  type MilestoneDetail,
  type ActionItem,
  type Link,
  type Resource,
} from '@/lib/api'
import { Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AddPersonDialog } from '@/components/AddPersonDialog'
import { AddMilestoneDialog } from '@/components/AddMilestoneDialog'
import { AddActionItemDialog } from '@/components/AddActionItemDialog'
import { AddLinkDialog } from '@/components/AddLinkDialog'
import { AddResourceDialog } from '@/components/AddResourceDialog'

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

function linkAuthor(l: Link) {
  return l.created_by_profile?.full_name || l.created_by_profile?.email || 'Unknown'
}

function resourceUpdatedBy(r: Resource) {
  return r.updated_by_profile?.full_name || r.updated_by_profile?.email || 'Unknown'
}

function relativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime()
  const sec = Math.round(diffMs / 1000)
  if (sec < 60) return `${sec} second${sec === 1 ? '' : 's'} ago`
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

function PencilIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  )
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
  const [milestoneDialogOpen, setMilestoneDialogOpen] = useState(false)
  const [editingMilestone, setEditingMilestone] = useState<MilestoneDetail | null>(null)
  const [addActionItemOpen, setAddActionItemOpen] = useState(false)
  const [links, setLinks] = useState<Link[]>([])
  const [linkDialogOpen, setLinkDialogOpen] = useState(false)
  const [editingLink, setEditingLink] = useState<Link | null>(null)
  const [editingMember, setEditingMember] = useState<ProjectMemberDetail | null>(null)
  const [editingActionItem, setEditingActionItem] = useState<ActionItem | null>(null)
  const [resources, setResources] = useState<Resource[]>([])
  const [addResourceOpen, setAddResourceOpen] = useState(false)
  const [editingResource, setEditingResource] = useState<Resource | null>(null)

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

  const loadLinks = useCallback(() => {
    if (!id) return
    linksApi
      .list(id)
      .then(setLinks)
      .catch(() => {})
  }, [id])

  const loadResources = useCallback(() => {
    if (!id) return
    resourcesApi
      .list(id)
      .then(setResources)
      .catch(() => {})
  }, [id])

  useEffect(() => {
    load()
    loadMilestones()
    loadActionItems()
    loadLinks()
    loadResources()
  }, [load, loadMilestones, loadActionItems, loadLinks, loadResources])

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

  const enabledActions = new Set([
    'Add Person',
    'Add Milestone',
    'Add Action Item',
    'Add Link',
    'Add Resource',
  ])

  function onAction(a: string) {
    if (a === 'Add Person') setAddPersonOpen(true)
    else if (a === 'Add Milestone') {
      setEditingMilestone(null)
      setMilestoneDialogOpen(true)
    } else if (a === 'Add Action Item') setAddActionItemOpen(true)
    else if (a === 'Add Link') {
      setEditingLink(null)
      setLinkDialogOpen(true)
    }
  }

  function openEditMilestone(milestoneId: string) {
    if (!id) return
    milestonesApi
      .get(id, milestoneId)
      .then((md) => {
        setEditingMilestone(md)
        setMilestoneDialogOpen(true)
      })
      .catch(() => {})
  }

  function openEditLink(l: Link) {
    setEditingLink(l)
    setLinkDialogOpen(true)
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
                  className="flex items-center gap-3 px-4 py-3 hover:bg-accent"
                >
                  <button
                    type="button"
                    onClick={() => setEditingMember(m)}
                    aria-label="Edit person"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <div className="flex flex-1 items-center justify-between">
                    <div>
                      <span className="text-sm font-medium">{memberName(m)}</span>
                      {m.status === 'pending' && (
                        <span className="ml-2 text-xs text-amber-600">
                          (pending)
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {m.role?.name ?? '—'}
                    </span>
                  </div>
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
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          openEditMilestone(m.id)
                        }}
                        title="Edit milestone"
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <PencilIcon />
                      </button>
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
                  className="flex items-start gap-3 px-4 py-3 hover:bg-accent"
                >
                  <button
                    type="button"
                    onClick={() => setEditingActionItem(a)}
                    aria-label="Edit action item"
                    className="mt-0.5 text-muted-foreground hover:text-foreground"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <div
                    onClick={() =>
                      navigate(`/projects/${project.id}/action-items/${a.id}`)
                    }
                    className="flex-1 cursor-pointer"
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
                      {a.milestone?.name && (
                        <span>Milestone: {a.milestone.name}</span>
                      )}
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
                  </div>
                </li>
              ))}
            </ul>
          )}

          <h2 className="mb-3 mt-8 text-lg font-semibold">Links</h2>
          {links.length === 0 ? (
            <p className="text-sm text-muted-foreground">No links yet.</p>
          ) : (
            <ul className="divide-y rounded-md border">
              {links.map((l) => (
                <li
                  key={l.id}
                  className="flex items-start gap-3 px-4 py-3 hover:bg-accent"
                >
                  <button
                    onClick={() => openEditLink(l)}
                    title="Edit link"
                    className="mt-0.5 text-muted-foreground hover:text-foreground"
                  >
                    <PencilIcon />
                  </button>
                  <a
                    href={l.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex flex-1 items-start justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-primary group-hover:underline">
                          {l.label || l.url}
                        </span>
                        {l.is_gold && (
                          <span className="inline-flex items-center gap-1 text-xs text-amber-600">
                            <span className="h-2 w-2 rounded-full bg-amber-500" />
                            Gold
                          </span>
                        )}
                      </div>
                      {l.description && (
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {l.description}
                        </p>
                      )}
                    </div>
                    <span className="whitespace-nowrap text-xs text-muted-foreground">
                      Added {relativeTime(l.created_at)} by {linkAuthor(l)}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          )}

          <h2 className="mb-3 mt-8 text-lg font-semibold">Resources</h2>
          {resources.length === 0 ? (
            <p className="text-sm text-muted-foreground">No resources yet.</p>
          ) : (
            <ul className="divide-y rounded-md border">
              {resources.map((r) => (
                <li
                  key={r.id}
                  className="flex items-start gap-3 px-4 py-3 hover:bg-accent"
                >
                  <button
                    type="button"
                    onClick={() => setEditingResource(r)}
                    aria-label="Edit resource"
                    className="mt-0.5 text-muted-foreground hover:text-foreground"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <div className="flex flex-1 items-start justify-between gap-4">
                    <div>
                      <span className="text-sm font-medium">{r.name}</span>
                      <div className="mt-0.5 flex flex-wrap gap-x-4 text-xs text-muted-foreground">
                        {r.type?.name && <span>Type: {r.type.name}</span>}
                        {r.description && <span>{r.description}</span>}
                      </div>
                    </div>
                    <span className="whitespace-nowrap text-xs text-muted-foreground">
                      Updated {relativeTime(r.updated_at)} by{' '}
                      {resourceUpdatedBy(r)}
                    </span>
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
        open={milestoneDialogOpen}
        onOpenChange={setMilestoneDialogOpen}
        existing={editingMilestone}
        onAdded={loadMilestones}
        onDeleted={loadMilestones}
      />

      <AddActionItemDialog
        projectId={project.id}
        open={addActionItemOpen}
        onOpenChange={setAddActionItemOpen}
        onSaved={loadActionItems}
      />

      <AddLinkDialog
        projectId={project.id}
        open={linkDialogOpen}
        onOpenChange={setLinkDialogOpen}
        existing={editingLink}
        onAdded={loadLinks}
      />
    </div>
  )
}