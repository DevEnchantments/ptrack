import { apiDelete, apiGet, apiPatch, apiPost } from './core'
import type {
  ActionItem,
  HistoryEntry,
  Milestone,
  ProgramOutcome,
} from './planning'
import type { Issue, Link, Resource, Risk } from './records'
import type { Submission } from './workflow'
import type { StatusReport, Update } from './updates'
import type { Attachment } from './attachments'

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
  deal_type_id: string | null
  tags: string[] | null
  actual_end_date: string | null
}

export interface ProjectMemberDetail {
  id: string
  user_id: string | null
  pending_email: string | null
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
  deal_type: { name: string } | null
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
