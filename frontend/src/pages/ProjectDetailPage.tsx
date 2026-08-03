import { toast } from '@/lib/toast'
import { useCallback, useEffect, useRef, useState } from 'react'
import { SectionCard } from '@/components/SectionCard'
import { SectionNav } from '@/components/SectionNav'
import { ProjectActions } from '@/components/ProjectActions'
import { StatusPill } from '@/components/StatusPill'
import { AvatarCluster, InitialsAvatar } from '@/components/InitialsAvatar'
import { Skeleton } from '@/components/ui/skeleton'
import { usePageTitle } from '@/lib/use-page-title'
import { formatDate, initials, relativeTime } from '@/lib/format'
// Aliased: `Link` is already taken by the record type from lib/api.
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom'
import {
  projectsApi,
  milestonesApi,
  outcomesApi,
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
  type ProgramOutcome,
  type MilestoneDetail,
  type ActionItem,
  type Link,
  type Resource,
  type Issue,
  type Update,
  type StatusReport,
  type Attachment,
} from '@/lib/api'
import { Pencil, Download, Loader2, Lock, Plus } from 'lucide-react'
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

/** Rows rendered per section before the "Show all" toggle takes over. */
const ROW_CAP = 25

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  if (value === null || value === undefined || value === '') return null
  return (
    <div className="grid grid-cols-1 gap-1 border-b px-1 py-3 last:border-0 sm:grid-cols-3 sm:gap-4">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="text-sm sm:col-span-2">{value}</dd>
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

function linkTitle(l: Link) {
  return l.label || l.url
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

function reportAuthor(r: StatusReport) {
  return r.author?.full_name || r.author?.email || 'Unknown'
}

const EXT_STYLES: Record<string, string> = {
  pdf: 'border-status-red-border bg-status-red-bg text-status-red-fg',
  doc: 'border-status-blue-border bg-status-blue-bg text-status-blue-fg',
  docx: 'border-status-blue-border bg-status-blue-bg text-status-blue-fg',
  xls: 'border-status-green-border bg-status-green-bg text-status-green-fg',
  xlsx: 'border-status-green-border bg-status-green-bg text-status-green-fg',
  csv: 'border-status-green-border bg-status-green-bg text-status-green-fg',
  ppt: 'border-status-amber-border bg-status-amber-bg text-status-amber-fg',
  pptx: 'border-status-amber-border bg-status-amber-bg text-status-amber-fg',
  png: 'border-status-amber-border bg-status-amber-bg text-status-amber-fg',
  jpg: 'border-status-amber-border bg-status-amber-bg text-status-amber-fg',
  jpeg: 'border-status-amber-border bg-status-amber-bg text-status-amber-fg',
  gif: 'border-status-amber-border bg-status-amber-bg text-status-amber-fg',
  zip: 'border-border bg-muted text-muted-foreground',
  rar: 'border-border bg-muted text-muted-foreground',
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

/**
 * Row-level edit affordance. 36px rather than the icon's own 16px so it clears
 * the touch-target floor; the negative margin keeps row height unchanged.
 * `label` carries the record name so no two rows share an accessible name.
 */
function EditButton({
  onClick,
  label,
  pending = false,
}: {
  onClick: () => void
  label: string
  pending?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      aria-label={label}
      aria-busy={pending || undefined}
      className="-my-1.5 -ml-1.5 flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring disabled:cursor-default"
    >
      {pending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Pencil className="h-4 w-4" />
      )}
    </button>
  )
}

/** Lifts a section's row cap. Renders nothing once everything is showing. */
function ShowAllRow({
  shown,
  total,
  onShowAll,
}: {
  shown: number
  total: number
  onShowAll: () => void
}) {
  if (shown >= total) return null
  return (
    <button
      type="button"
      onClick={onShowAll}
      className="mt-2 w-full cursor-pointer rounded-md border border-dashed px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
    >
      Show all {total}
    </button>
  )
}

/** Shared dashed empty block, matching SectionCard's own empty state. */
function EmptyState({
  label,
  actionLabel,
  onAction,
}: {
  label: string
  actionLabel: string
  onAction: () => void
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-md border border-dashed px-4 py-5">
      <p className="text-sm text-muted-foreground">{label}</p>
      <Button variant="outline" size="sm" onClick={onAction}>
        <Plus className="h-4 w-4" />
        {actionLabel}
      </Button>
    </div>
  )
}

const SECTION_IDS = [
  { id: 'people', label: 'People' },
  { id: 'milestones', label: 'Milestones' },
  { id: 'action-items', label: 'Action Items' },
  { id: 'links', label: 'Links' },
  { id: 'resources', label: 'Resources' },
  { id: 'issues', label: 'Issues' },
  { id: 'updates', label: 'Updates' },
  { id: 'status-reports', label: 'Status Reports' },
  { id: 'attachments', label: 'Attachments' },
]

const SECTION_ID_SET = new Set(SECTION_IDS.map((s) => s.id))

interface ProjectPrefs {
  collapsed: Record<string, boolean>
  showAllIssues: boolean
}

function prefsKey(projectId: string) {
  return `ptrack:prefs:${projectId}`
}

function readPrefs(projectId: string): ProjectPrefs {
  try {
    const raw = localStorage.getItem(prefsKey(projectId))
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<ProjectPrefs>
      return {
        collapsed: parsed.collapsed ?? {},
        showAllIssues: parsed.showAllIssues ?? true,
      }
    }
    // The pre-2026-07-30 key stored the collapse map on its own; carry it
    // forward so saved collapse state survives the rename.
    const legacy = localStorage.getItem(`ptrack:collapsed:${projectId}`)
    return {
      collapsed: legacy ? (JSON.parse(legacy) as Record<string, boolean>) : {},
      showAllIssues: true,
    }
  } catch {
    return { collapsed: {}, showAllIssues: true }
  }
}

function writePrefs(projectId: string, prefs: ProjectPrefs) {
  try {
    localStorage.setItem(prefsKey(projectId), JSON.stringify(prefs))
  } catch {
    // Storage full/blocked — prefs still apply for this visit.
  }
}

/** Open work with a due date in the past gets the red treatment. */
function isOverdue(dueDate: string | null, status: string): boolean {
  if (!dueDate || status !== 'open') return false
  return dueDate < new Date().toISOString().slice(0, 10)
}

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** Flips true one frame after mount so CSS transitions run (starts true on reduced motion). */
function useEntranceFlag(): boolean {
  const [entered, setEntered] = useState(() => prefersReducedMotion())
  useEffect(() => {
    const raf = requestAnimationFrame(() =>
      requestAnimationFrame(() => setEntered(true)),
    )
    return () => cancelAnimationFrame(raf)
  }, [])
  return entered
}

export function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [project, setProject] = useState<ProjectDetail | null>(null)
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [outcomes, setOutcomes] = useState<ProgramOutcome[]>([])
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
  const [pendingMilestoneId, setPendingMilestoneId] = useState<string | null>(null)
  const [actionItemOpen, setActionItemOpen] = useState(false)
  const [editingActionItem, setEditingActionItem] = useState<ActionItem | null>(null)
  const [linkOpen, setLinkOpen] = useState(false)
  const [editingLink, setEditingLink] = useState<Link | null>(null)
  const [resourceOpen, setResourceOpen] = useState(false)
  const [editingResource, setEditingResource] = useState<Resource | null>(null)
  const [issues, setIssues] = useState<Issue[]>([])
  const [issueOpen, setIssueOpen] = useState(false)
  const [editingIssue, setEditingIssue] = useState<Issue | null>(null)
  const [updates, setUpdates] = useState<Update[]>([])
  const [updateOpen, setUpdateOpen] = useState(false)
  const [editingUpdate, setEditingUpdate] = useState<Update | null>(null)
  const [statusReports, setStatusReports] = useState<StatusReport[]>([])
  const [statusReportOpen, setStatusReportOpen] = useState(false)
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [attachmentOpen, setAttachmentOpen] = useState(false)
  const [editingAttachment, setEditingAttachment] = useState<Attachment | null>(null)
  const [editProjectOpen, setEditProjectOpen] = useState(false)

  // --- UX pass: section loading, prefs, row caps, scroll-spy, entrance ---
  const [sectionsLoading, setSectionsLoading] = useState(true)
  const [prefs, setPrefs] = useState<ProjectPrefs>(() =>
    id ? readPrefs(id) : { collapsed: {}, showAllIssues: true },
  )
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({})
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [titleInView, setTitleInView] = useState(true)
  const titleRef = useRef<HTMLHeadingElement | null>(null)
  // Last id written to the URL, so scroll-spy only calls replaceState on change.
  const hashRef = useRef<string | null>(null)
  const entered = useEntranceFlag()
  usePageTitle(project?.name)

  // Reload prefs when navigating between projects (render-phase prev-key
  // pattern — the set-state-in-effect rule bans the effect shape).
  const [prevPrefsId, setPrevPrefsId] = useState(id)
  if (prevPrefsId !== id) {
    setPrevPrefsId(id)
    setPrefs(id ? readPrefs(id) : { collapsed: {}, showAllIssues: true })
    setExpandedSections({})
  }

  function updatePrefs(patch: Partial<ProjectPrefs>) {
    const next = { ...prefs, ...patch }
    setPrefs(next)
    if (id) writePrefs(id, next)
  }

  function toggleSection(sectionId: string) {
    updatePrefs({
      collapsed: {
        ...prefs.collapsed,
        [sectionId]: !prefs.collapsed[sectionId],
      },
    })
  }

  function expandSection(sectionId: string) {
    setExpandedSections((cur) => ({ ...cur, [sectionId]: true }))
  }

  function rowsFor<T>(sectionId: string, rows: T[]): T[] {
    return expandedSections[sectionId] ? rows : rows.slice(0, ROW_CAP)
  }

  // Scroll-spy: highlight the section nearest the top of the viewport, and
  // mirror it into the URL so the current position is copyable. replaceState
  // (not pushState) keeps the back button pointing at the previous page.
  useEffect(() => {
    if (sectionsLoading) return
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        const nextId = visible[0]?.target.id
        if (!nextId) return
        setActiveSection(nextId)
        if (hashRef.current !== nextId) {
          hashRef.current = nextId
          window.history.replaceState(null, '', `#${nextId}`)
        }
      },
      { rootMargin: '-96px 0px -55% 0px' },
    )
    for (const s of SECTION_IDS) {
      const el = document.getElementById(s.id)
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
  }, [sectionsLoading])

  // Honor an incoming #section hash. Has to wait for the sections to have
  // data: at first paint they are skeletons, so the browser's own hash scroll
  // lands at the wrong offset.
  useEffect(() => {
    if (sectionsLoading) return
    const hash = window.location.hash.slice(1)
    if (!hash || !SECTION_ID_SET.has(hash)) return
    const el = document.getElementById(hash)
    if (!el) return
    // No setActiveSection here: the scroll-spy observer picks the chip up as
    // soon as the jump lands, and setting it here would be a cascading render.
    hashRef.current = hash
    el.scrollIntoView({
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
      block: 'start',
    })
  }, [sectionsLoading])

  // Show the project name in the sticky bar once the H1 scrolls away.
  useEffect(() => {
    const el = titleRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setTitleInView(entry.isIntersecting),
      { rootMargin: '-56px 0px 0px 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [project])

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
    outcomesApi.list(id).then(setOutcomes).catch(() => toast.error('Could not load outcomes.'))
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

  // Initial load: the project itself plus all eight section lists in one
  // request. The per-section load* callbacks above stay in use for refreshing
  // a single section after its dialog saves.
  useEffect(() => {
    if (!id) return
    load()
    projectsApi
      .sections(id)
      .then((s) => {
        setMilestones(s.milestones)
        setOutcomes(s.outcomes)
        setActionItems(s.actionItems)
        setLinks(s.links)
        setResources(s.resources)
        setIssues(s.issues)
        setUpdates(s.updates)
        setStatusReports(s.statusReports)
        setAttachments(s.attachments)
      })
      .catch(() => toast.error('Could not load project sections.'))
      .finally(() => setSectionsLoading(false))
  }, [id, load])

  if (loading) {
    // Skeleton mirroring the real layout: breadcrumb, title, fields, sections.
    return (
      <div className="min-h-svh">
        <header className="border-b px-6 py-4">
          <Skeleton className="h-4 w-40" />
        </header>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 p-6 lg:grid-cols-[1fr_260px]">
          <div>
            <div className="mb-6 flex items-center justify-between">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-8 w-24" />
            </div>
            <div className="flex flex-col gap-3 rounded-md border p-4">
              {Array.from({ length: 6 }, (_, i) => (
                <div key={i} className="flex gap-6">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 flex-1" />
                </div>
              ))}
            </div>
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="mt-8">
                <Skeleton className="mb-3 h-6 w-40" />
                <div className="flex flex-col gap-2 rounded-md border p-4">
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
          <aside className="hidden lg:block">
            <div className="flex flex-col gap-2 rounded-md border p-3">
              {Array.from({ length: 9 }, (_, i) => (
                <Skeleton key={i} className="h-7 w-full" />
              ))}
            </div>
          </aside>
        </div>
      </div>
    )
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

  // Unlike every other section's edit, this one fetches before it can open, so
  // the row's pencil shows a spinner instead of appearing dead on a slow link.
  function openEditMilestone(milestoneId: string) {
    if (!project) return
    setPendingMilestoneId(milestoneId)
    milestonesApi
      .get(project.id, milestoneId)
      .then((md) => {
        setEditingMilestone(md)
        setMilestoneOpen(true)
      })
      .catch(() => toast.error('Could not open the milestone.'))
      .finally(() => setPendingMilestoneId(null))
  }

  // The Issues section filters in place, so its count follows the filter —
  // otherwise the header reads "Issues 7" above a body saying "No open issues."
  const visibleIssues = prefs.showAllIssues
    ? issues
    : issues.filter((i) => i.status === 'open')

  const peopleRows = rowsFor('people', project.members)
  const milestoneRows = rowsFor('milestones', milestones)
  const actionItemRows = rowsFor('action-items', actionItems)
  const linkRows = rowsFor('links', links)
  const resourceRows = rowsFor('resources', resources)
  const issueRows = rowsFor('issues', visibleIssues)
  const updateRows = rowsFor('updates', updates)
  const statusReportRows = rowsFor('status-reports', statusReports)
  const attachmentRows = rowsFor('attachments', attachments)

  const sectionCounts: Record<string, number> = {
    people: project.members.length,
    milestones: milestones.length,
    'action-items': actionItems.length,
    links: links.length,
    resources: resources.length,
    issues: visibleIssues.length,
    updates: updates.length,
    'status-reports': statusReports.length,
    attachments: attachments.length,
  }
  const sectionMeta = SECTION_IDS.map((s) => ({
    ...s,
    count: sectionCounts[s.id] ?? 0,
  }))

  const closedMilestones = milestones.filter(
    (m) => m.status === 'closed_completed',
  ).length

  // FDD Fig 2: milestones grouped under numbered outcomes; flat list when no
  // outcomes exist. Ungrouped milestones trail under their own header. Grouping
  // runs on the capped rows so "Show all" governs the section as a whole.
  const outcomeRange = (o: ProgramOutcome) =>
    o.start_date && o.end_date
      ? ` (${formatDate(o.start_date)} to ${formatDate(o.end_date)})`
      : o.start_date
        ? ` (from ${formatDate(o.start_date)})`
        : o.end_date
          ? ` (until ${formatDate(o.end_date)})`
          : ''
  const grouped = outcomes
    .map((o) => ({
      key: o.id,
      header: `${o.sort_order != null ? `${o.sort_order}. ` : ''}${o.name}${outcomeRange(o)}`,
      items: milestoneRows.filter((m) => m.outcome_id === o.id),
    }))
    .filter((g) => g.items.length > 0)
  const ungroupedMilestones = milestoneRows.filter((m) => !m.outcome_id)
  const milestoneGroups =
    grouped.length === 0
      ? [{ key: 'all', header: null as string | null, items: milestoneRows }]
      : [
          ...grouped,
          ...(ungroupedMilestones.length > 0
            ? [
                {
                  key: 'ungrouped',
                  header: 'No outcome' as string | null,
                  items: ungroupedMilestones,
                },
              ]
            : []),
        ]

  return (
    <div className="min-h-svh">
      <header className="border-b px-6 py-4">
        <button
          onClick={() => navigate('/')}
          className="cursor-pointer text-sm text-muted-foreground hover:underline"
        >
          Projects
        </button>
        <span className="mx-2 text-muted-foreground">/</span>
        <span className="inline-flex items-center gap-1 text-sm">
          {project.access_control === 'restricted' && (
            <Lock className="h-4 w-4 text-muted-foreground" />
          )}
          {project.name}
        </span>
      </header>

      <SectionNav
        sections={sectionMeta}
        activeId={activeSection}
        projectName={project.name}
        restricted={project.access_control === 'restricted'}
        showName={!titleInView}
        onEdit={() => setEditProjectOpen(true)}
        onAction={onAction}
      />

      {/* --nav-h feeds SectionCard's scroll-margin: the sticky bar grows by the
          project-name band once the H1 scrolls away, so a fixed offset would
          overshoot in one of the two states. */}
      <div
        className="mx-auto grid max-w-5xl grid-cols-1 gap-8 p-6 lg:grid-cols-[1fr_260px]"
        style={
          { '--nav-h': titleInView ? '3.5rem' : '6rem' } as React.CSSProperties
        }
      >
        <div>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Project
              </p>
              <h1
                ref={titleRef}
                className="flex items-center gap-2 text-2xl font-semibold"
              >
                {project.access_control === 'restricted' && (
                  <Lock className="h-4 w-4 text-muted-foreground" />
                )}
                {project.name}
              </h1>
            </div>
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
            <Field
              label="Project Start Date"
              value={project.start_date ? formatDate(project.start_date) : null}
            />
            <Field label="Project Size" value={project.size?.name ?? null} />
            <Field label="Reference ID" value={project.reference_id} />
            <Field label="Project Number" value={project.project_number} />
            <Field label="Plan Year" value={project.plan_year} />
            <Field
              label="Strategic Objective"
              value={project.strategic_objective?.name ?? null}
            />
            <Field label="Tier" value={project.tier?.name ?? null} />
            <Field
              label="Approved Budget"
              value={
                project.approved_budget != null
                  ? `AED ${Number(project.approved_budget).toLocaleString()}`
                  : null
              }
            />
            <Field
              label="Utilized Budget"
              value={
                project.utilized_budget != null
                  ? `AED ${Number(project.utilized_budget).toLocaleString()}`
                  : null
              }
            />
            <Field label="Finance Code" value={project.finance_code} />
            <Field
              label="Internal Stakeholder"
              value={project.internal_stakeholder}
            />
            <Field label="Target Group" value={project.target_group} />
            <Field
              label="Priority"
              value={project.is_priority ? 'Yes' : null}
            />
            <Field
              label="Tags"
              value={project.tags?.length ? project.tags.join(', ') : null}
            />
            <Field label="Primary URL" value={primaryUrlValue} />
            <Field label="Created" value={formatDate(project.created_at)} />
            <Field
              label="Last Updated"
              value={formatDate(project.updated_at)}
            />
          </dl>

          <SectionCard
            id="people"
            title="People"
            count={project.members.length}
            collapsed={!!prefs.collapsed['people']}
            onToggle={() => toggleSection('people')}
            index={0}
            entered={entered}
            loading={false}
            emptyLabel="No people assigned yet."
            emptyActionLabel="Add person"
            onEmptyAction={() => onAction('Add Person')}
          >
            <>
              <ul className="section-list divide-y rounded-md border">
                {peopleRows.map((m) => (
                  <li
                    key={m.id}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-accent"
                  >
                    <EditButton
                      label={`Edit person ${memberName(m)}`}
                      onClick={() => {
                        setEditingMember(m)
                        setPersonOpen(true)
                      }}
                    />
                    <div className="flex flex-1 items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <InitialsAvatar name={memberName(m)} />
                        <span className="text-sm font-medium">{memberName(m)}</span>
                        {m.status === 'pending' && (
                          <span className="text-xs text-gold">(pending)</span>
                        )}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {m.role?.name ?? '—'}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
              <ShowAllRow
                shown={peopleRows.length}
                total={project.members.length}
                onShowAll={() => expandSection('people')}
              />
            </>
          </SectionCard>

          <SectionCard
            id="milestones"
            title="Milestones"
            count={milestones.length}
            collapsed={!!prefs.collapsed['milestones']}
            onToggle={() => toggleSection('milestones')}
            index={1}
            entered={entered}
            loading={sectionsLoading}
            emptyLabel="No milestones yet."
            emptyActionLabel="Add milestone"
            onEmptyAction={() => onAction('Add Milestone')}
            headerExtra={
              milestones.length > 0 ? (
                <span className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="h-1.5 w-24 overflow-hidden rounded-full bg-muted">
                    <span
                      className="block h-full rounded-full bg-(--chart-1) transition-[width] duration-500"
                      style={{
                        width: `${Math.round((closedMilestones / milestones.length) * 100)}%`,
                      }}
                    />
                  </span>
                  {closedMilestones}/{milestones.length} closed
                </span>
              ) : undefined
            }
          >
            <>
              {/* One list per outcome, each under a real heading: the group
                  label used to be an <li>, which screen readers announced as
                  just another milestone. */}
              <div className="overflow-hidden rounded-md border">
                {milestoneGroups.map((g, gi) => (
                  <div key={g.key}>
                    {g.header && (
                      <h3
                        className={`bg-muted/40 px-4 py-2 text-xs font-medium text-muted-foreground ${
                          gi > 0 ? 'border-t' : ''
                        }`}
                      >
                        {g.header}
                      </h3>
                    )}
                    <ul className="section-list divide-y border-t first:border-t-0">
                      {g.items.map((m) => (
                        <li
                          key={m.id}
                          className="flex items-start gap-3 px-4 py-3 hover:bg-accent"
                        >
                          <EditButton
                            label={`Edit milestone ${m.name}`}
                            pending={pendingMilestoneId === m.id}
                            onClick={() => openEditMilestone(m.id)}
                          />
                          {/* A real <a>, so middle-click, ctrl-click and
                              "open in new tab" work like anywhere else. */}
                          <RouterLink
                            to={`/projects/${project.id}/milestones/${m.id}`}
                            className="flex-1 rounded focus-visible:outline-2 focus-visible:outline-ring"
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
                              <StatusPill
                                status={m.status}
                                label={STATUS_LABELS[m.status] ?? m.status}
                              />
                            </div>
                            <div className="mt-1 flex flex-wrap gap-x-4 text-xs text-muted-foreground">
                              {m.due_date && (
                                <span
                                  className={
                                    isOverdue(m.due_date, m.status)
                                      ? 'font-medium text-destructive'
                                      : ''
                                  }
                                >
                                  Due {formatDate(m.due_date)}
                                  {isOverdue(m.due_date, m.status) && ' — overdue'}
                                </span>
                              )}
                              {ownerName(m) && (
                                <span className="flex items-center gap-1.5">
                                  Owner:
                                  <InitialsAvatar name={ownerName(m) as string} size="sm" />
                                  {ownerName(m)}
                                </span>
                              )}
                              {m.role?.name && <span>Role: {m.role.name}</span>}
                              {m.percent_complete !== null &&
                                m.percent_complete !== undefined && (
                                  <span className="flex items-center gap-1.5">
                                    <span className="h-1 w-14 overflow-hidden rounded-full bg-muted">
                                      <span
                                        className="block h-full rounded-full bg-(--chart-1)"
                                        style={{
                                          width: `${Math.min(Math.max(m.percent_complete, 0), 100)}%`,
                                        }}
                                      />
                                    </span>
                                    {m.percent_complete}%
                                  </span>
                                )}
                            </div>
                          </RouterLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <ShowAllRow
                shown={milestoneRows.length}
                total={milestones.length}
                onShowAll={() => expandSection('milestones')}
              />
            </>
          </SectionCard>

          <SectionCard
            id="action-items"
            title="Action Items"
            count={actionItems.length}
            collapsed={!!prefs.collapsed['action-items']}
            onToggle={() => toggleSection('action-items')}
            index={2}
            entered={entered}
            loading={sectionsLoading}
            emptyLabel="No action items yet."
            emptyActionLabel="Add action item"
            onEmptyAction={() => onAction('Add Action Item')}
          >
            <>
              <ul className="section-list divide-y rounded-md border">
                {actionItemRows.map((a) => (
                  <li
                    key={a.id}
                    className="flex items-start gap-3 px-4 py-3 hover:bg-accent"
                  >
                    <EditButton
                      label={`Edit action item ${a.title}`}
                      onClick={() => {
                        setEditingActionItem(a)
                        setActionItemOpen(true)
                      }}
                    />
                    <RouterLink
                      to={`/projects/${project.id}/action-items/${a.id}`}
                      className="flex-1 rounded focus-visible:outline-2 focus-visible:outline-ring"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{a.title}</span>
                        <StatusPill
                          status={a.status}
                          label={STATUS_LABELS[a.status] ?? a.status}
                        />
                      </div>
                      <div className="mt-1 flex flex-wrap gap-x-4 text-xs text-muted-foreground">
                        {a.due_date && (
                          <span
                            className={
                              isOverdue(a.due_date, a.status)
                                ? 'font-medium text-destructive'
                                : ''
                            }
                          >
                            Due {formatDate(a.due_date)}
                            {isOverdue(a.due_date, a.status) && ' — overdue'}
                          </span>
                        )}
                        {a.type?.name && <span>Type: {a.type.name}</span>}
                        {a.milestone?.name && (
                          <span>Milestone: {a.milestone.name}</span>
                        )}
                        {a.owners.length > 0 && (
                          <span className="flex items-center gap-1.5">
                            Owners:
                            <AvatarCluster
                              names={a.owners
                                .slice()
                                .sort((x, y) => x.slot - y.slot)
                                .map(
                                  (o) =>
                                    o.profile?.full_name ||
                                    o.profile?.email ||
                                    '—',
                                )}
                            />
                          </span>
                        )}
                      </div>
                    </RouterLink>
                  </li>
                ))}
              </ul>
              <ShowAllRow
                shown={actionItemRows.length}
                total={actionItems.length}
                onShowAll={() => expandSection('action-items')}
              />
            </>
          </SectionCard>

          <SectionCard
            id="links"
            title="Links"
            count={links.length}
            collapsed={!!prefs.collapsed['links']}
            onToggle={() => toggleSection('links')}
            index={3}
            entered={entered}
            loading={sectionsLoading}
            emptyLabel="No links yet."
            emptyActionLabel="Add link"
            onEmptyAction={() => onAction('Add Link')}
          >
            <>
              <ul className="section-list divide-y rounded-md border">
                {linkRows.map((l) => (
                  <li
                    key={l.id}
                    className="flex items-start gap-3 px-4 py-3 hover:bg-accent"
                  >
                    <EditButton
                      label={`Edit link ${linkTitle(l)}`}
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
                            {linkTitle(l)}
                          </span>
                          {l.is_gold && (
                            <span className="inline-flex items-center gap-1 text-xs text-gold">
                              <span className="h-2 w-2 rounded-full bg-gold" />
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
                      <span
                        title={formatDate(l.created_at)}
                        className="whitespace-nowrap text-xs text-muted-foreground"
                      >
                        Added {relativeTime(l.created_at)} by {linkAuthor(l)}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
              <ShowAllRow
                shown={linkRows.length}
                total={links.length}
                onShowAll={() => expandSection('links')}
              />
            </>
          </SectionCard>

          <SectionCard
            id="resources"
            title="Resources"
            count={resources.length}
            collapsed={!!prefs.collapsed['resources']}
            onToggle={() => toggleSection('resources')}
            index={4}
            entered={entered}
            loading={sectionsLoading}
            emptyLabel="No resources yet."
            emptyActionLabel="Add resource"
            onEmptyAction={() => onAction('Add Resource')}
          >
            <>
              <ul className="section-list divide-y rounded-md border">
                {resourceRows.map((r) => (
                  <li
                    key={r.id}
                    className="flex items-start gap-3 px-4 py-3 hover:bg-accent"
                  >
                    <EditButton
                      label={`Edit resource ${r.name}`}
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
                      <span
                        title={formatDate(r.updated_at)}
                        className="whitespace-nowrap text-xs text-muted-foreground"
                      >
                        Updated {relativeTime(r.updated_at)} by {resourceUpdatedBy(r)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
              <ShowAllRow
                shown={resourceRows.length}
                total={resources.length}
                onShowAll={() => expandSection('resources')}
              />
            </>
          </SectionCard>

          <SectionCard
            id="issues"
            title="Issues"
            count={visibleIssues.length}
            collapsed={!!prefs.collapsed['issues']}
            onToggle={() => toggleSection('issues')}
            index={5}
            entered={entered}
            loading={sectionsLoading}
            ownEmptyState
            emptyLabel="No issues yet."
            emptyActionLabel="Add issue"
            onEmptyAction={() => onAction('Add Issue')}
          >
            <>
              {/* The filter lives inside the section body, so this section owns
                  its empty state: handing it to SectionCard would hide the very
                  control that emptied the list. */}
              <label className="mb-3 -ml-1 inline-flex cursor-pointer items-center gap-2 rounded-md px-1 py-1.5 text-sm has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-ring">
                <input
                  type="checkbox"
                  className="h-4 w-4 cursor-pointer accent-primary outline-none"
                  checked={prefs.showAllIssues}
                  onChange={(e) =>
                    updatePrefs({ showAllIssues: e.target.checked })
                  }
                />
                Show All Issues (Open and Closed)
              </label>
              {issueRows.length === 0 ? (
                <EmptyState
                  label={
                    prefs.showAllIssues ? 'No issues yet.' : 'No open issues.'
                  }
                  actionLabel="Add issue"
                  onAction={() => onAction('Add Issue')}
                />
              ) : (
                <>
                  <ul className="section-list divide-y rounded-md border">
                    {issueRows.map((i) => (
                      <li
                        key={i.id}
                        className="flex items-start gap-3 px-4 py-3 hover:bg-accent"
                      >
                        <EditButton
                          label={`Edit issue ${i.title}`}
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
                            <StatusPill
                              status={i.status}
                              label={ISSUE_STATUS_LABELS[i.status] ?? i.status}
                            />
                          </div>
                          <div className="mt-1 flex flex-wrap gap-x-4 text-xs text-muted-foreground">
                            {i.category?.name && (
                              <span>Category: {i.category.name}</span>
                            )}
                            {i.level?.name && <span>Level: {i.level.name}</span>}
                            {issueOwnerDisplay(i) && (
                              <span>Owner: {issueOwnerDisplay(i)}</span>
                            )}
                            <span title={formatDate(i.updated_at)}>
                              Updated {relativeTime(i.updated_at)}
                            </span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <ShowAllRow
                    shown={issueRows.length}
                    total={visibleIssues.length}
                    onShowAll={() => expandSection('issues')}
                  />
                </>
              )}
            </>
          </SectionCard>

          <SectionCard
            id="updates"
            title="Updates"
            count={updates.length}
            collapsed={!!prefs.collapsed['updates']}
            onToggle={() => toggleSection('updates')}
            index={6}
            entered={entered}
            loading={sectionsLoading}
            emptyLabel="No updates yet."
            emptyActionLabel="Add update"
            onEmptyAction={() => onAction('Add Update')}
          >
            <>
              <ul className="section-list flex flex-col gap-4">
                {updateRows.map((u) => (
                  <li key={u.id} className="flex gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
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
                        <span title={formatDate(u.created_at)}>
                          · {relativeTime(u.created_at)}
                        </span>
                        {u.is_gold && (
                          <span className="inline-flex items-center gap-1 text-gold">
                            <span className="h-2 w-2 rounded-full bg-gold" />
                            Gold
                          </span>
                        )}
                        {/* Kept at 28px rather than the shared EditButton's
                            36px: this sits in a 16px meta line, and the taller
                            control would visibly loosen the feed. */}
                        <button
                          type="button"
                          onClick={() => {
                            setEditingUpdate(u)
                            setUpdateOpen(true)
                          }}
                          aria-label={`Edit update by ${updateAuthorName(u)}`}
                          className="-my-1 flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <ShowAllRow
                shown={updateRows.length}
                total={updates.length}
                onShowAll={() => expandSection('updates')}
              />
            </>
          </SectionCard>

          <SectionCard
            id="status-reports"
            title="Status Reports"
            count={statusReports.length}
            collapsed={!!prefs.collapsed['status-reports']}
            onToggle={() => toggleSection('status-reports')}
            index={7}
            entered={entered}
            loading={sectionsLoading}
            emptyLabel="No status reports yet."
            emptyActionLabel="Add status report"
            onEmptyAction={() => onAction('Add Status Report')}
          >
            <>
              <ul className="section-list divide-y rounded-md border">
                {statusReportRows.map((r) => (
                  <li key={r.id} className="hover:bg-accent">
                    <RouterLink
                      to={`/projects/${project.id}/status-reports/${r.id}`}
                      className="block px-4 py-3 focus-visible:outline-2 focus-visible:outline-ring"
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
                        <div>{formatDate(r.report_date)}</div>
                      </div>
                    </div>
                    </RouterLink>
                  </li>
                ))}
              </ul>
              <ShowAllRow
                shown={statusReportRows.length}
                total={statusReports.length}
                onShowAll={() => expandSection('status-reports')}
              />
            </>
          </SectionCard>

          <SectionCard
            id="attachments"
            title="Attachments"
            count={attachments.length}
            collapsed={!!prefs.collapsed['attachments']}
            onToggle={() => toggleSection('attachments')}
            index={8}
            entered={entered}
            loading={sectionsLoading}
            emptyLabel="No attachments yet."
            emptyActionLabel="Attach file"
            onEmptyAction={() => onAction('Attach File')}
          >
            <>
              <ul className="section-list divide-y rounded-md border">
                {attachmentRows.map((a) => {
                  const ext = fileExt(a.file_name)
                  const iconCls = EXT_STYLES[ext.toLowerCase()] ?? 'border-border bg-muted text-muted-foreground'
                  return (
                    <li
                      key={a.id}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-accent"
                    >
                      <EditButton
                        label={`Edit attachment ${a.file_name}`}
                        onClick={() => {
                          setEditingAttachment(a)
                          setAttachmentOpen(true)
                        }}
                      />
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md border ${iconCls} text-[9px] font-bold`}
                      >
                        {ext.slice(0, 4) || 'FILE'}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <RouterLink
                            to={`/projects/${project.id}/attachments/${a.id}`}
                            className="truncate text-left text-sm font-medium text-primary hover:underline focus-visible:outline-2 focus-visible:outline-ring"
                          >
                            {a.file_name}
                          </RouterLink>
                          {a.is_gold && (
                            <span className="inline-flex shrink-0 items-center gap-1 text-xs text-gold">
                              <span className="h-2 w-2 rounded-full bg-gold" />
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
                      <div
                        title={formatDate(a.created_at)}
                        className="whitespace-nowrap text-right text-xs text-muted-foreground"
                      >
                        <div>{relativeTime(a.created_at)}</div>
                        <div>by {attachmentUploader(a)}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => downloadAttachment(a.id)}
                        aria-label={`Download ${a.file_name}`}
                        className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-md border transition-colors hover:bg-background focus-visible:outline-2 focus-visible:outline-ring"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    </li>
                  )
                })}
              </ul>
              <ShowAllRow
                shown={attachmentRows.length}
                total={attachments.length}
                onShowAll={() => expandSection('attachments')}
              />
            </>
          </SectionCard>
        </div>

        {/* Below `lg` the rail would sit under all nine sections, so the same
            actions ride in the sticky nav's "Add" dialog instead. */}
        <aside className="hidden lg:sticky lg:top-24 lg:block lg:self-start">
          <ProjectActions onAction={onAction} />
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
