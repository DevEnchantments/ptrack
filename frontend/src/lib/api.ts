import { supabase } from '@/lib/supabase'

const API_URL =
  (import.meta.env.VITE_API_URL as string) ?? 'http://localhost:3000'

async function authHeader(): Promise<Record<string, string>> {
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let message = `Request failed (${res.status})`
    try {
      const body = await res.json()
      if (Array.isArray(body?.message)) message = body.message.join(', ')
      else message = body?.message ?? message
    } catch {
      /* no JSON body */
    }
    throw new Error(message)
  }
  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}

export async function apiGet<T>(path: string): Promise<T> {
  const headers = await authHeader()
  return handle<T>(await fetch(`${API_URL}${path}`, { headers }))
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const headers = await authHeader()
  return handle<T>(
    await fetch(`${API_URL}${path}`, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }),
  )
}

export async function apiPatch<T>(path: string, body: unknown): Promise<T> {
  const headers = await authHeader()
  return handle<T>(
    await fetch(`${API_URL}${path}`, {
      method: 'PATCH',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }),
  )
}

export async function apiDelete<T>(path: string): Promise<T> {
  const headers = await authHeader()
  return handle<T>(
    await fetch(`${API_URL}${path}`, { method: 'DELETE', headers }),
  )
}

export interface Project {
  id: string
  name: string
  description: string | null
  parent_project_id: string | null
  status_id: string | null
  size_id: string | null
  category_id: string | null
  access_control: string
  start_date: string | null
  target_end_date: string | null
  sponsor: string | null
  created_by: string | null
  created_at: string
  updated_at: string
  // FDD Stage-1 fields (docs/FDD-ALIGNMENT.md section 1.1)
  reference_id: string | null
  project_number: string | null
  plan_year: number | null
  finance_code: string | null
  target_group: string | null
  internal_stakeholder: string | null
  is_priority: boolean
  approved_budget: number | null
  utilized_budget: number | null
  tier_id: string | null
  strategic_objective_id: string | null
  // FDD register columns (Wave 1.1, ASSUMED semantics)
  manual_progress: number | null
  at_risk: boolean
  // FDD person fields (Wave 1.2; owner_id doubles as Project Owner)
  owner_id: string | null
  project_manager_id: string | null
  project_manager2_id: string | null
  pmo_partner_id: string | null
  // FDD Wave 1.3 (ASSUMED shapes)
  external_stakeholders: string[] | null
  sector_id: string | null
  strategic_program_id: string | null
}

export interface ProjectMemberDetail {
  id: string
  user_id: string | null
  pending_name: string | null
  role_id: string | null
  access_level: string
  involvement_level_id: string | null
  notes: string | null
  status: string
  role: { name: string } | null
  profile: { full_name: string | null; email: string | null } | null
}

export interface ProjectDetail extends Project {
  size_id: string | null
  category_id: string | null
  goal: string | null
  customer: string | null
  tags: string[] | null
  primary_url: string | null
  updated_at: string
  status: { name: string } | null
  size: { name: string } | null
  category: { name: string } | null
  tier: { name: string } | null
  strategic_objective: { name: string } | null
  sector: { name: string } | null
  strategic_program: { name: string } | null
  owner: { full_name: string | null; email: string | null } | null
  project_manager: { full_name: string | null; email: string | null } | null
  project_manager2: { full_name: string | null; email: string | null } | null
  pmo_partner: { full_name: string | null; email: string | null } | null
  members: ProjectMemberDetail[]
}

// All eight section lists of a project in a single request (initial page load);
// the per-section list endpoints remain for refreshes after a save.
export interface ProjectSections {
  milestones: Milestone[]
  outcomes: ProgramOutcome[]
  actionItems: ActionItem[]
  links: Link[]
  resources: Resource[]
  issues: Issue[]
  risks: Risk[]
  submissions: Submission[]
  updates: Update[]
  statusReports: StatusReport[]
  attachments: Attachment[]
}

// Aggregates the list endpoint attaches to each project (home cards).
export interface ProjectListItem extends Project {
  // Register-grid joins (Fig 1 columns)
  owner: { full_name: string | null; email: string | null } | null
  project_manager: { full_name: string | null; email: string | null } | null
  sector: { name: string } | null
  tier: { name: string } | null
  status: { name: string } | null
  milestones_done: number
  milestones_total: number
  open_issues: number
  /** F1/F2, docs/FORMULAS.md (PROVISIONAL). */
  calculated_progress: number | null
  planned_progress: number | null
}

export const projectsApi = {
  list: () => apiGet<ProjectListItem[]>('/projects'),
  get: (id: string) => apiGet<ProjectDetail>(`/projects/${id}`),
  sections: (id: string) =>
    apiGet<ProjectSections>(`/projects/${id}/sections`),
  history: (id: string) =>
    apiGet<HistoryEntry[]>(`/projects/${id}/history`),
  create: (data: Record<string, unknown>) =>
    apiPost<Project>('/projects', data),
  update: (id: string, data: Record<string, unknown>) =>
    apiPatch<ProjectDetail>(`/projects/${id}`, data),
  remove: (id: string) =>
    apiDelete<{ deleted: boolean }>(`/projects/${id}`),
}

export interface UserSummary {
  id: string
  full_name: string | null
  email: string | null
}

export const usersApi = {
  search: (query: string) =>
    apiGet<UserSummary[]>(`/users?search=${encodeURIComponent(query)}`),
}

export interface Lookup {
  id: string
  name: string
  /** Present only on cascading lookups (strategic-programs). */
  objective_id?: string | null
}

// Lookups are near-static, but every dialog open refetches them. Cache the
// in-flight promise (not just the data) so simultaneous mounts share one
// request; drop failed promises so a network blip doesn't cache an error.
const LOOKUP_TTL_MS = 60_000
const lookupCache = new Map<string, { p: Promise<Lookup[]>; expires: number }>()

export const lookupsApi = {
  list: (name: string): Promise<Lookup[]> => {
    const hit = lookupCache.get(name)
    if (hit && hit.expires > Date.now()) return hit.p
    const p = apiGet<Lookup[]>(`/lookups/${name}`)
    lookupCache.set(name, { p, expires: Date.now() + LOOKUP_TTL_MS })
    p.catch(() => lookupCache.delete(name))
    return p
  },
  invalidate: (name: string) => {
    lookupCache.delete(name)
  },
}

export const categoriesApi = {
  create: async (name: string) => {
    const row = await apiPost<Lookup>('/lookups/project-categories', { name })
    lookupsApi.invalidate('project-categories')
    return row
  },
}

export const sectorsApi = {
  create: async (name: string) => {
    const row = await apiPost<Lookup>('/lookups/sectors', { name })
    lookupsApi.invalidate('sectors')
    return row
  },
}

export const rolesApi = {
  create: async (name: string, default_access_level: string) => {
    const row = await apiPost<Lookup>('/lookups/project-roles', {
      name,
      default_access_level,
    })
    lookupsApi.invalidate('project-roles')
    return row
  },
}

export const peopleApi = {
  add: (projectId: string, data: Record<string, unknown>) =>
    apiPost<unknown>(`/projects/${projectId}/people`, data),
  update: (projectId: string, memberId: string, data: Record<string, unknown>) =>
    apiPatch<unknown>(`/projects/${projectId}/people/${memberId}`, data),
  remove: (projectId: string, memberId: string) =>
    apiDelete<{ deleted: boolean }>(`/projects/${projectId}/people/${memberId}`),
}

export interface ProgramOutcome {
  id: string
  project_id: string
  name: string
  sort_order: number | null
  start_date: string | null
  end_date: string | null
}

export const outcomesApi = {
  list: (projectId: string) =>
    apiGet<ProgramOutcome[]>(`/projects/${projectId}/outcomes`),
  create: (projectId: string, data: Record<string, unknown>) =>
    apiPost<ProgramOutcome>(`/projects/${projectId}/outcomes`, data),
}

export interface Milestone {
  id: string
  project_id: string
  name: string
  description: string | null
  start_date: string | null
  due_date: string | null
  original_due_date: string | null
  status: string
  role_id: string | null
  owner_id: string | null
  is_major: boolean
  tags: string[] | null
  weightage: number | null
  percent_complete: number | null
  // FDD Fig 2 outcome grouping (docs/FDD-ALIGNMENT.md section 1.2)
  outcome_id: string | null
  outcome?: { id: string; name: string; sort_order: number | null } | null
  role: { name: string } | null
  owner: { full_name: string | null; email: string | null } | null
}

export interface MilestoneDetail extends Milestone {
  completed_date: string | null
  created_at: string
  updated_at: string
  project?: { name: string } | null
  created_by_profile?: { full_name: string | null; email: string | null } | null
  updated_by_profile?: { full_name: string | null; email: string | null } | null
}

/**
 * One field-level change (or the record's creation). old_value / new_value are
 * already display-ready text — the DB trigger resolves FKs to names and formats
 * dates at write time, so an entry shows what the value WAS at the time.
 */
export interface HistoryEntry {
  id: string
  event: 'created' | 'changed' | 'deleted'
  /** Present on project-wide history (which table the row came from). */
  table_name?: string
  field_label: string | null
  old_value: string | null
  new_value: string | null
  changed_at: string
  actor: { full_name: string | null; email: string | null } | null
}

export const milestonesApi = {
  list: (projectId: string) =>
    apiGet<Milestone[]>(`/projects/${projectId}/milestones`),
  adjustWeights: (
    projectId: string,
    weights: Array<{ id: string; weightage: number | null }>,
  ) =>
    apiPatch<Milestone[]>(`/projects/${projectId}/milestones/weights`, {
      weights,
    }),
  history: (projectId: string, milestoneId: string) =>
    apiGet<HistoryEntry[]>(
      `/projects/${projectId}/milestones/${milestoneId}/history`,
    ),
  get: (projectId: string, milestoneId: string) =>
    apiGet<MilestoneDetail>(
      `/projects/${projectId}/milestones/${milestoneId}`,
    ),
  add: (projectId: string, data: Record<string, unknown>) =>
    apiPost<Milestone>(`/projects/${projectId}/milestones`, data),
  update: (
    projectId: string,
    milestoneId: string,
    data: Record<string, unknown>,
  ) =>
    apiPatch<MilestoneDetail>(
      `/projects/${projectId}/milestones/${milestoneId}`,
      data,
    ),
  remove: (projectId: string, milestoneId: string) =>
    apiDelete<{ deleted: boolean }>(
      `/projects/${projectId}/milestones/${milestoneId}`,
    ),
}

export interface ActionItemOwner {
  slot: number
  user_id: string
  profile: { full_name: string | null; email: string | null } | null
}

export interface ActionItem {
  id: string
  project_id: string
  milestone_id: string | null
  title: string
  description: string | null
  type_id: string | null
  role_id: string | null
  due_date: string | null
  status: string
  tags: string[] | null
  type: { name: string } | null
  role: { name: string } | null
  milestone: { name: string } | null
  project?: { name: string } | null
  owners: ActionItemOwner[]
  created_at?: string
  updated_at?: string
  created_by_profile?: { full_name: string | null; email: string | null } | null
  updated_by_profile?: { full_name: string | null; email: string | null } | null
}

export interface ActionItemComment {
  id: string
  action_item_id: string
  body: string
  created_at: string
  author: { full_name: string | null; email: string | null } | null
}

export const actionItemsApi = {
  list: (projectId: string) =>
    apiGet<ActionItem[]>(`/projects/${projectId}/action-items`),
  get: (projectId: string, actionItemId: string) =>
    apiGet<ActionItem>(`/projects/${projectId}/action-items/${actionItemId}`),
  add: (projectId: string, data: Record<string, unknown>) =>
    apiPost<ActionItem>(`/projects/${projectId}/action-items`, data),
  update: (
    projectId: string,
    actionItemId: string,
    data: Record<string, unknown>,
  ) =>
    apiPatch<ActionItem>(
      `/projects/${projectId}/action-items/${actionItemId}`,
      data,
    ),
  history: (projectId: string, actionItemId: string) =>
    apiGet<HistoryEntry[]>(
      `/projects/${projectId}/action-items/${actionItemId}/history`,
    ),
  remove: (projectId: string, actionItemId: string) =>
    apiDelete<{ deleted: boolean }>(
      `/projects/${projectId}/action-items/${actionItemId}`,
    ),
  listComments: (projectId: string, actionItemId: string) =>
    apiGet<ActionItemComment[]>(
      `/projects/${projectId}/action-items/${actionItemId}/comments`,
    ),
  addComment: (projectId: string, actionItemId: string, body: string) =>
    apiPost<ActionItemComment>(
      `/projects/${projectId}/action-items/${actionItemId}/comments`,
      { body },
    ),
}
export interface Link {
  id: string
  project_id: string
  label: string | null
  url: string
  description: string | null
  is_gold: boolean
  tags: string[] | null
  created_at: string
  updated_at: string
  created_by_profile?: { full_name: string | null; email: string | null } | null
}

export const linksApi = {
  list: (projectId: string) =>
    apiGet<Link[]>(`/projects/${projectId}/links`),
  add: (projectId: string, data: Record<string, unknown>) =>
    apiPost<Link>(`/projects/${projectId}/links`, data),
  update: (projectId: string, linkId: string, data: Record<string, unknown>) =>
    apiPatch<Link>(`/projects/${projectId}/links/${linkId}`, data),
  remove: (projectId: string, linkId: string) =>
    apiDelete<{ deleted: boolean }>(`/projects/${projectId}/links/${linkId}`),
}

export interface Resource {
  id: string
  project_id: string
  name: string
  type_id: string | null
  description: string | null
  created_at: string
  updated_at: string
  type: { name: string } | null
  updated_by_profile?: { full_name: string | null; email: string | null } | null
}

export const resourcesApi = {
  list: (projectId: string) =>
    apiGet<Resource[]>(`/projects/${projectId}/resources`),
  add: (projectId: string, data: Record<string, unknown>) =>
    apiPost<Resource>(`/projects/${projectId}/resources`, data),
  update: (
    projectId: string,
    resourceId: string,
    data: Record<string, unknown>,
  ) =>
    apiPatch<Resource>(`/projects/${projectId}/resources/${resourceId}`, data),
  remove: (projectId: string, resourceId: string) =>
    apiDelete<{ deleted: boolean }>(
      `/projects/${projectId}/resources/${resourceId}`,
    ),
}

export interface Issue {
  id: string
  project_id: string
  title: string
  description: string | null
  category_id: string | null
  level_id: string | null
  role_id: string | null
  owner_id: string | null
  status: string
  url: string | null
  reference_identifier: string | null
  tags: string[] | null
  resolution: string | null
  // FDD issue-register extensions (docs/FDD-ALIGNMENT.md section 1.5)
  recommendation: string | null
  reported_by: string | null
  date_closed: string | null
  created_at: string
  updated_at: string
  category: { name: string } | null
  level: { name: string } | null
  role: { name: string } | null
  owner: { full_name: string | null; email: string | null } | null
  updated_by_profile?: { full_name: string | null; email: string | null } | null
}

export const issuesApi = {
  list: (projectId: string) =>
    apiGet<Issue[]>(`/projects/${projectId}/issues`),
  add: (projectId: string, data: Record<string, unknown>) =>
    apiPost<Issue>(`/projects/${projectId}/issues`, data),
  update: (projectId: string, issueId: string, data: Record<string, unknown>) =>
    apiPatch<Issue>(`/projects/${projectId}/issues/${issueId}`, data),
  remove: (projectId: string, issueId: string) =>
    apiDelete<{ deleted: boolean }>(`/projects/${projectId}/issues/${issueId}`),
}

export interface Risk {
  id: string
  project_id: string
  statement: string
  identified_by: string | null
  date_identified: string | null
  source_id: string | null
  category_id: string | null
  owner_id: string | null
  probability_id: string | null
  impact_id: string | null
  response_id: string | null
  response_plan: string | null
  priority: string | null
  action: string | null
  status: string
  type: string
  created_at: string
  updated_at: string
  source: { name: string } | null
  category: { name: string } | null
  probability: { name: string; sort_order: number | null } | null
  impact: { name: string; sort_order: number | null } | null
  response: { name: string } | null
  owner: { full_name: string | null; email: string | null } | null
}

export const risksApi = {
  list: (projectId: string) => apiGet<Risk[]>(`/projects/${projectId}/risks`),
  add: (projectId: string, data: Record<string, unknown>) =>
    apiPost<Risk>(`/projects/${projectId}/risks`, data),
  update: (projectId: string, riskId: string, data: Record<string, unknown>) =>
    apiPatch<Risk>(`/projects/${projectId}/risks/${riskId}`, data),
  remove: (projectId: string, riskId: string) =>
    apiDelete<{ deleted: boolean }>(`/projects/${projectId}/risks/${riskId}`),
}

export interface Cycle {
  id: string
  name: string
  period_start: string
  period_end: string
  status: string
}

export interface Submission {
  id: string
  project_id: string
  cycle_id: string
  status: string
  comment: string | null
  decision_comment: string | null
  submitted_by: string | null
  submitted_at: string | null
  validated_at: string | null
  approved_at: string | null
  returned_at: string | null
  created_at: string
  updated_at: string
  cycle: Cycle | null
  submitter: { full_name: string | null; email: string | null } | null
  validator: { full_name: string | null; email: string | null } | null
  approver: { full_name: string | null; email: string | null } | null
  returner: { full_name: string | null; email: string | null } | null
}

export interface AppNotification {
  id: string
  user_id: string
  project_id: string | null
  type: string
  title: string
  body: string | null
  read_at: string | null
  created_at: string
}

export const notificationsApi = {
  list: () => apiGet<AppNotification[]>('/notifications'),
  markRead: (id: string) =>
    apiPost<{ ok: boolean }>(`/notifications/${id}/read`, {}),
  markAllRead: () => apiPost<{ ok: boolean }>('/notifications/read-all', {}),
}

export interface CycleStatusRow {
  project_id: string
  name: string
  owner: string | null
  project_manager: string | null
  status: string
  submitted_at: string | null
}

export interface CycleStatusReport {
  cycle: Cycle | null
  rows: CycleStatusRow[]
}

export const reportsApi = {
  cycleStatus: () => apiGet<CycleStatusReport>('/reports/cycle-status'),
}

export const submissionsApi = {
  list: (projectId: string) =>
    apiGet<Submission[]>(`/projects/${projectId}/submissions`),
  submit: (projectId: string, comment?: string) =>
    apiPost<Submission>(`/projects/${projectId}/submissions/submit`, {
      comment: comment?.trim() || undefined,
    }),
  act: (
    projectId: string,
    submissionId: string,
    action: 'validate' | 'approve' | 'return' | 'reject',
    comment?: string,
  ) =>
    apiPost<Submission>(
      `/projects/${projectId}/submissions/${submissionId}/${action}`,
      { comment: comment?.trim() || undefined },
    ),
}

export interface Update {
  id: string
  project_id: string
  headline: string | null
  body: string | null
  type_id: string | null
  is_gold: boolean
  tags: string[] | null
  author_id: string | null
  created_at: string
  updated_at: string
  type: { name: string } | null
  author: { full_name: string | null; email: string | null } | null
}

export const updatesApi = {
  list: (projectId: string) =>
    apiGet<Update[]>(`/projects/${projectId}/updates`),
  add: (projectId: string, data: Record<string, unknown>) =>
    apiPost<Update>(`/projects/${projectId}/updates`, data),
  update: (projectId: string, updateId: string, data: Record<string, unknown>) =>
    apiPatch<Update>(`/projects/${projectId}/updates/${updateId}`, data),
  remove: (projectId: string, updateId: string) =>
    apiDelete<{ deleted: boolean }>(
      `/projects/${projectId}/updates/${updateId}`,
    ),
}

export interface StatusReport {
  id: string
  project_id: string
  title: string | null
  summary: string | null
  report_date: string
  viewable_by: string
  editable_by: string
  author_id: string | null
  created_at: string
  updated_at: string
  author: { full_name: string | null; email: string | null } | null
}

export interface StatusReportDetail extends StatusReport {
  project: { name: string } | null
}

export const statusReportsApi = {
  list: (projectId: string) =>
    apiGet<StatusReport[]>(`/projects/${projectId}/status-reports`),
  get: (projectId: string, statusReportId: string) =>
    apiGet<StatusReportDetail>(
      `/projects/${projectId}/status-reports/${statusReportId}`,
    ),
  add: (projectId: string, data: Record<string, unknown>) =>
    apiPost<StatusReport>(`/projects/${projectId}/status-reports`, data),
  update: (
    projectId: string,
    statusReportId: string,
    data: Record<string, unknown>,
  ) =>
    apiPatch<StatusReport>(
      `/projects/${projectId}/status-reports/${statusReportId}`,
      data,
    ),
  remove: (projectId: string, statusReportId: string) =>
    apiDelete<{ deleted: boolean }>(
      `/projects/${projectId}/status-reports/${statusReportId}`,
    ),
}

// Multipart upload (FormData). Do NOT set Content-Type — the browser adds the
// multipart boundary itself. Only the Authorization header is attached.
export async function apiUpload<T>(path: string, formData: FormData): Promise<T> {
  const headers = await authHeader()
  return handle<T>(
    await fetch(`${API_URL}${path}`, {
      method: 'POST',
      headers,
      body: formData,
    }),
  )
}

export interface Attachment {
  id: string
  project_id: string
  file_name: string
  bucket: string
  storage_path: string
  mime_type: string | null
  size_bytes: number | null
  is_gold: boolean
  description: string | null
  tags: string[] | null
  uploaded_by: string | null
  created_at: string
  uploaded_by_profile?: { full_name: string | null; email: string | null } | null
}

export interface AttachmentDetail extends Attachment {
  project: { name: string } | null
}

export const attachmentsApi = {
  list: (projectId: string) =>
    apiGet<Attachment[]>(`/projects/${projectId}/attachments`),
  get: (projectId: string, attachmentId: string) =>
    apiGet<AttachmentDetail>(
      `/projects/${projectId}/attachments/${attachmentId}`,
    ),
  upload: (projectId: string, formData: FormData) =>
    apiUpload<Attachment>(`/projects/${projectId}/attachments`, formData),
  downloadUrl: (projectId: string, attachmentId: string) =>
    apiGet<{ url: string }>(
      `/projects/${projectId}/attachments/${attachmentId}/download`,
    ),
  update: (
    projectId: string,
    attachmentId: string,
    data: Record<string, unknown>,
  ) =>
    apiPatch<Attachment>(
      `/projects/${projectId}/attachments/${attachmentId}`,
      data,
    ),
  remove: (projectId: string, attachmentId: string) =>
    apiDelete<{ deleted: boolean }>(
      `/projects/${projectId}/attachments/${attachmentId}`,
    ),
}