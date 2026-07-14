import { toast } from '@/lib/toast'
import { useCallback, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  projectsApi,
  milestonesApi,
  actionItemsApi,
  linksApi,
  resourcesApi,
  issuesApi,
  updatesApi,
  statusReportsApi,
  attachmentsApi,
  type ProjectDetail,
  type ProjectMemberDetail,
  type Milestone,
  type MilestoneDetail,
  type ActionItem,
  type Link,
  type Resource,
  type Issue,
  type Update,
  type StatusReport,
  type Attachment,
} from '@/lib/api'
import { Pencil, Download, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AddPersonDialog } from '@/components/AddPersonDialog'
import { AddMilestoneDialog } from '@/components/AddMilestoneDialog'
import { AddActionItemDialog } from '@/components/AddActionItemDialog'
import { AddLinkDialog } from '@/components/AddLinkDialog'
import { AddResourceDialog } from '@/components/AddResourceDialog'
import { AddIssueDialog } from '@/components/AddIssueDialog'
import { AddUpdateDialog } from '@/components/AddUpdateDialog'
import { AddStatusReportDialog } from '@/components/AddStatusReportDialog'
import { AddAttachmentDialog } from '@/components/AddAttachmentDialog'
import { EditProjectDialog } from '@/components/EditProjectDialog'

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

const ISSUE_STATUS_LABELS: Record<string, string> = {
  open: 'Open',
  in_progress: 'In Progress',
  resolved: 'Resolved',
  closed: 'Closed',
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

function issueOwnerDisplay(i: Issue): string | null {
  const owner = i.owner?.full_name || i.owner?.email || null
  const role = i.role?.name || null
  if (role && owner) return `${role}: ${owner}`
  return owner || role || null
}

function updateAuthorName(u: Update) {
  return u.author?.full_name || u.author?.email || 'Unknown'
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[1][0]).toUpperCase()
}

function reportAuthor(r: StatusReport) {
  return r.author?.full_name || r.author?.email || 'Unknown'
}

function formatReportDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00')
  if (isNaN(d.getTime())) return iso
  const day = String(d.getDate()).padStart(2, '0')
  const mon = d.toLocaleString('en-US', { month: 'short' }).toUpperCase()
  return `${day}-${mon}-${d.getFullYear()}`
}

const EXT_STYLES: Record<string, string> = {
  pdf: 'bg-red-600',
  doc: 'bg-blue-600',
  docx: 'bg-blue-600',
  xls: 'bg-green-600',
  xlsx: 'bg-green-600',
  csv: 'bg-green-600',
  ppt: 'bg-orange-600',
  pptx: 'bg-orange-600',
  png: 'bg-amber-500',
  jpg: 'bg-amber-500',
  jpeg: 'bg-amber-500',
  gif: 'bg-amber-500',
  zip: 'bg-slate-500',
  rar: 'bg-slate-500',
}

function fileExt(name: string): string {
  const parts = name.split('.')
  return parts.length > 1 ? (parts.pop() as string).toUpperCase() : ''
}

function formatSize(bytes: number | null): string {
  if (bytes == null) return ''
  if (bytes === 0) return '0'
  if (bytes < 1024) return `${bytes}B`
  const kb = bytes / 1024
  if (kb < 1024) return `${Math.round(kb)}KB`
  const mb = kb / 1024
  if (mb < 1024) return `${Math.round(mb)}MB`
  return `${(mb / 1024).toFixed(1)}GB`
}

function attachmentUploader(a: Attachment) {
  return (
    a.uploaded_by_profile?.full_name ||
    a.uploaded_by_profile?.email ||
    'Unknown'
  )
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

function EditButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="mt-0.5 text-muted-foreground hover:text-foreground"
    >
      <Pencil className="h-4 w-4" />
    </button>
  )
}

export function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [project, setProject] = useState<ProjectDetail | null>(null)
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [actionItems, setActionItems] = useState<ActionItem[]>([])
  const [links, setLinks] = useState<Link[]>([])
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // One dialog per record type; `editing*` = null means "create".
  const [personOpen, setPersonOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<ProjectMemberDetail | null>(null)
  const [milestoneOpen, setMilestoneOpen] = useState(false)
  const [editingMilestone, setEditingMilestone] = useState<MilestoneDetail | null>(null)
  const [actionItemOpen, setActionItemOpen] = useState(false)
  const [editingActionItem, setEditingActionItem] = useState<ActionItem | null>(null)
  const [linkOpen, setLinkOpen] = useState(false)
  const [editingLink, setEditingLink] = useState<Link | null>(null)
  const [resourceOpen, setResourceOpen] = useState(false)
  const [editingResource, setEditingResource] = useState<Resource | null>(null)
  const [issues, setIssues] = useState<Issue[]>([])
  const [issueOpen, setIssueOpen] = useState(false)
  const [editingIssue, setEditingIssue] = useState<Issue | null>(null)
  const [showAllIssues, setShowAllIssues] = useState(true)
  const [updates, setUpdates] = useState<Update[]>([])
  const [updateOpen, setUpdateOpen] = useState(false)
  const [editingUpdate, setEditingUpdate] = useState<Update | null>(null)
  const [statusReports, setStatusReports] = useState<StatusReport[]>([])
  const [statusReportOpen, setStatusReportOpen] = useState(false)
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [attachmentOpen, setAttachmentOpen] = useState(false)
  const [editingAttachment, setEditingAttachment] = useState<Attachment | null>(null)
  const [editProjectOpen, setEditProjectOpen] = useState(false)

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
    milestonesApi.list(id).then(setMilestones).catch(() => toast.error('Could not load milestones.'))
  }, [id])

  const loadActionItems = useCallback(() => {
    if (!id) return
    actionItemsApi.list(id).then(setActionItems).catch(() => toast.error('Could not load action items.'))
  }, [id])

  const loadLinks = useCallback(() => {
    if (!id) return
    linksApi.list(id).then(setLinks).catch(() => toast.error('Could not load links.'))
  }, [id])

  const loadResources = useCallback(() => {
    if (!id) return
    resourcesApi.list(id).then(setResources).catch(() => toast.error('Could not load resources.'))
  }, [id])

  const loadIssues = useCallback(() => {
    if (!id) return
    issuesApi.list(id).then(setIssues).catch(() => toast.error('Could not load issues.'))
  }, [id])

  const loadUpdates = useCallback(() => {
    if (!id) return
    updatesApi.list(id).then(setUpdates).catch(() => toast.error('Could not load updates.'))
  }, [id])

  const loadStatusReports = useCallback(() => {
    if (!id) return
    statusReportsApi.list(id).then(setStatusReports).catch(() => toast.error('Could not load status reports.'))
  }, [id])

  const loadAttachments = useCallback(() => {
    if (!id) return
    attachmentsApi.list(id).then(setAttachments).catch(() => toast.error('Could not load attachments.'))
  }, [id])

  useEffect(() => {
    load()
    loadMilestones()
    loadActionItems()
    loadLinks()
    loadResources()
    loadIssues()
    loadUpdates()
    loadStatusReports()
    loadAttachments()
  }, [
    load,
    loadMilestones,
    loadActionItems,
    loadLinks,
    loadResources,
    loadIssues,
    loadUpdates,
    loadStatusReports,
    loadAttachments,
  ])

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
    'Add Issue',
    'Add Update',
    'Add Status Report',
    'Attach File',
  ])

  function onAction(a: string) {
    if (a === 'Add Person') {
      setEditingMember(null)
      setPersonOpen(true)
    } else if (a === 'Add Milestone') {
      setEditingMilestone(null)
      setMilestoneOpen(true)
    } else if (a === 'Add Action Item') {
      setEditingActionItem(null)
      setActionItemOpen(true)
    } else if (a === 'Add Link') {
      setEditingLink(null)
      setLinkOpen(true)
    } else if (a === 'Add Resource') {
      setEditingResource(null)
      setResourceOpen(true)
    } else if (a === 'Add Issue') {
      setEditingIssue(null)
      setIssueOpen(true)
    } else if (a === 'Add Update') {
      setEditingUpdate(null)
      setUpdateOpen(true)
    } else if (a === 'Add Status Report') {
      setStatusReportOpen(true)
    } else if (a === 'Attach File') {
      setEditingAttachment(null)
      setAttachmentOpen(true)
    }
  }

  function downloadAttachment(attachmentId: string) {
    if (!project) return
    attachmentsApi
      .downloadUrl(project.id, attachmentId)
      .then(({ url }) => window.open(url, '_blank'))
      .catch(() => toast.error('Could not get the download link.'))
  }

  function openEditMilestone(milestoneId: string) {
    if (!project) return
    milestonesApi
      .get(project.id, milestoneId)
      .then((md) => {
        setEditingMilestone(md)
        setMilestoneOpen(true)
      })
      .catch(() => toast.error('Could not open the milestone.'))
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
        <span className="inline-flex items-center gap-1 text-sm">
          {project.access_control === 'restricted' && (
            <Lock className="h-3.5 w-3.5 text-muted-foreground" />
          )}
          {project.name}
        </span>
      </header>

      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 p-6 lg:grid-cols-[1fr_260px]">
        <div>
          <div className="mb-6 flex items-center justify-between">
            <h1 className="flex items-center gap-2 text-2xl font-semibold">
              {project.access_control === 'restricted' && (
                <Lock className="h-5 w-5 text-muted-foreground" />
              )}
              {project.name}
            </h1>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditProjectOpen(true)}
            >
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
                  <EditButton
                    label="Edit person"
                    onClick={() => {
                      setEditingMember(m)
                      setPersonOpen(true)
                    }}
                  />
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
                  className="flex items-start gap-3 px-4 py-3 hover:bg-accent"
                >
                  <EditButton
                    label="Edit milestone"
                    onClick={() => openEditMilestone(m.id)}
                  />
                  <div
                    onClick={() =>
                      navigate(`/projects/${project.id}/milestones/${m.id}`)
                    }
                    className="flex-1 cursor-pointer"
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
                  <EditButton
                    label="Edit action item"
                    onClick={() => {
                      setEditingActionItem(a)
                      setActionItemOpen(true)
                    }}
                  />
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
                  <EditButton
                    label="Edit link"
                    onClick={() => {
                      setEditingLink(l)
                      setLinkOpen(true)
                    }}
                  />
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
                  <EditButton
                    label="Edit resource"
                    onClick={() => {
                      setEditingResource(r)
                      setResourceOpen(true)
                    }}
                  />
                  <div className="flex flex-1 items-start justify-between gap-4">
                    <div>
                      <span className="text-sm font-medium">{r.name}</span>
                      <div className="mt-0.5 flex flex-wrap gap-x-4 text-xs text-muted-foreground">
                        {r.type?.name && <span>Type: {r.type.name}</span>}
                        {r.description && <span>{r.description}</span>}
                      </div>
                    </div>
                    <span className="whitespace-nowrap text-xs text-muted-foreground">
                      Updated {relativeTime(r.updated_at)} by {resourceUpdatedBy(r)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <h2 className="mb-3 mt-8 text-lg font-semibold">Issues</h2>
          {issues.length === 0 ? (
            <p className="text-sm text-muted-foreground">No issues yet.</p>
          ) : (
            <>
              <label className="mb-3 flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-primary"
                  checked={showAllIssues}
                  onChange={(e) => setShowAllIssues(e.target.checked)}
                />
                Show All Issues (Open and Closed)
              </label>
              {(() => {
                const visible = showAllIssues
                  ? issues
                  : issues.filter((i) => i.status === 'open')
                if (visible.length === 0)
                  return (
                    <p className="text-sm text-muted-foreground">
                      No open issues.
                    </p>
                  )
                return (
                  <ul className="divide-y rounded-md border">
                    {visible.map((i) => (
                      <li
                        key={i.id}
                        className="flex items-start gap-3 px-4 py-3 hover:bg-accent"
                      >
                        <EditButton
                          label="Edit issue"
                          onClick={() => {
                            setEditingIssue(i)
                            setIssueOpen(true)
                          }}
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">
                              {i.title}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {ISSUE_STATUS_LABELS[i.status] ?? i.status}
                            </span>
                          </div>
                          <div className="mt-1 flex flex-wrap gap-x-4 text-xs text-muted-foreground">
                            {i.category?.name && (
                              <span>Category: {i.category.name}</span>
                            )}
                            {i.level?.name && <span>Level: {i.level.name}</span>}
                            {issueOwnerDisplay(i) && (
                              <span>Owner: {issueOwnerDisplay(i)}</span>
                            )}
                            <span>Updated {relativeTime(i.updated_at)}</span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )
              })()}
            </>
          )}

          <h2 className="mb-3 mt-8 text-lg font-semibold">Updates</h2>
          {updates.length === 0 ? (
            <p className="text-sm text-muted-foreground">No updates yet.</p>
          ) : (
            <ul className="flex flex-col gap-4">
              {updates.map((u) => (
                <li key={u.id} className="flex gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-400 text-xs font-semibold text-white">
                    {initials(updateAuthorName(u))}
                  </div>
                  <div className="flex-1">
                    <div className="inline-block whitespace-pre-wrap rounded-md bg-muted px-3 py-2 text-sm">
                      {u.body}
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">
                        {updateAuthorName(u)}
                      </span>
                      <span>· {relativeTime(u.created_at)}</span>
                      {u.is_gold && (
                        <span className="inline-flex items-center gap-1 text-amber-600">
                          <span className="h-2 w-2 rounded-full bg-amber-500" />
                          Gold
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setEditingUpdate(u)
                          setUpdateOpen(true)
                        }}
                        aria-label="Edit update"
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <h2 className="mb-3 mt-8 text-lg font-semibold">Status Reports</h2>
          {statusReports.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No status reports yet.
            </p>
          ) : (
            <ul className="divide-y rounded-md border">
              {statusReports.map((r) => (
                <li
                  key={r.id}
                  onClick={() =>
                    navigate(
                      `/projects/${project.id}/status-reports/${r.id}`,
                    )
                  }
                  className="cursor-pointer px-4 py-3 hover:bg-accent"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <span className="text-sm font-medium">{r.title}</span>
                      {r.summary && (
                        <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                          {r.summary}
                        </p>
                      )}
                    </div>
                    <div className="whitespace-nowrap text-right text-xs text-muted-foreground">
                      <div>{reportAuthor(r)}</div>
                      <div>{formatReportDate(r.report_date)}</div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <h2 className="mb-3 mt-8 text-lg font-semibold">Attachments</h2>
          {attachments.length === 0 ? (
            <p className="text-sm text-muted-foreground">No attachments yet.</p>
          ) : (
            <ul className="divide-y rounded-md border">
              {attachments.map((a) => {
                const ext = fileExt(a.file_name)
                const iconCls = EXT_STYLES[ext.toLowerCase()] ?? 'bg-slate-400'
                return (
                  <li
                    key={a.id}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-accent"
                  >
                    <EditButton
                      label="Edit attachment"
                      onClick={() => {
                        setEditingAttachment(a)
                        setAttachmentOpen(true)
                      }}
                    />
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded ${iconCls} text-[9px] font-bold text-white`}
                    >
                      {ext.slice(0, 4) || 'FILE'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            navigate(
                              `/projects/${project.id}/attachments/${a.id}`,
                            )
                          }
                          className="truncate text-left text-sm font-medium text-primary hover:underline"
                        >
                          {a.file_name}
                        </button>
                        {a.is_gold && (
                          <span className="inline-flex shrink-0 items-center gap-1 text-xs text-amber-600">
                            <span className="h-2 w-2 rounded-full bg-amber-500" />
                            Gold
                          </span>
                        )}
                      </div>
                      {a.description && (
                        <p className="truncate text-xs text-muted-foreground">
                          {a.description}
                        </p>
                      )}
                    </div>
                    <span className="whitespace-nowrap text-sm text-muted-foreground">
                      {formatSize(a.size_bytes)}
                    </span>
                    <div className="whitespace-nowrap text-right text-xs text-muted-foreground">
                      <div>{relativeTime(a.created_at)}</div>
                      <div>by {attachmentUploader(a)}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => downloadAttachment(a.id)}
                      aria-label="Download"
                      className="rounded border p-2 hover:bg-background"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </li>
                )
              })}
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
        open={personOpen}
        onOpenChange={(o) => {
          setPersonOpen(o)
          if (!o) setEditingMember(null)
        }}
        existing={editingMember}
        onAdded={load}
        onRemoved={load}
      />

      <AddMilestoneDialog
        projectId={project.id}
        open={milestoneOpen}
        onOpenChange={(o) => {
          setMilestoneOpen(o)
          if (!o) setEditingMilestone(null)
        }}
        existing={editingMilestone}
        onAdded={loadMilestones}
        onDeleted={loadMilestones}
      />

      <AddActionItemDialog
        projectId={project.id}
        open={actionItemOpen}
        onOpenChange={(o) => {
          setActionItemOpen(o)
          if (!o) setEditingActionItem(null)
        }}
        existing={editingActionItem}
        onSaved={loadActionItems}
        onDeleted={loadActionItems}
      />

      <AddLinkDialog
        projectId={project.id}
        open={linkOpen}
        onOpenChange={(o) => {
          setLinkOpen(o)
          if (!o) setEditingLink(null)
        }}
        existing={editingLink}
        onAdded={loadLinks}
      />

      <AddResourceDialog
        projectId={project.id}
        open={resourceOpen}
        onOpenChange={(o) => {
          setResourceOpen(o)
          if (!o) setEditingResource(null)
        }}
        existing={editingResource}
        onAdded={loadResources}
      />

      <AddIssueDialog
        projectId={project.id}
        open={issueOpen}
        onOpenChange={(o) => {
          setIssueOpen(o)
          if (!o) setEditingIssue(null)
        }}
        existing={editingIssue}
        onAdded={loadIssues}
      />

      <AddUpdateDialog
        projectId={project.id}
        open={updateOpen}
        onOpenChange={(o) => {
          setUpdateOpen(o)
          if (!o) setEditingUpdate(null)
        }}
        existing={editingUpdate}
        onAdded={loadUpdates}
      />

      <AddStatusReportDialog
        projectId={project.id}
        projectName={project.name}
        open={statusReportOpen}
        onOpenChange={setStatusReportOpen}
        onAdded={loadStatusReports}
      />

      <AddAttachmentDialog
        projectId={project.id}
        open={attachmentOpen}
        onOpenChange={(o) => {
          setAttachmentOpen(o)
          if (!o) setEditingAttachment(null)
        }}
        existing={editingAttachment}
        onAdded={loadAttachments}
      />

      <EditProjectDialog
        project={project}
        open={editProjectOpen}
        onOpenChange={setEditProjectOpen}
        onSaved={load}
        onDeleted={() => navigate('/')}
      />
    </div>
  )
}