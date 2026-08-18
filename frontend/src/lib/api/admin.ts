import { apiDelete, apiGet, apiPatch, apiPost, apiPut } from './core'

export interface KpiReading {
  id: string
  kpi_id: string
  reading_date: string
  value: number
  performance_analysis: string | null
  created_at: string
}

export interface KpiActionPlan {
  id: string
  kpi_id: string
  description: string
  owner: string | null
  due_date: string | null
  status: string
  created_at: string
}

export interface Kpi {
  id: string
  name: string
  description: string | null
  pillar: string | null
  entity: string | null
  unit: string | null
  polarity: string
  decimal_places: number
  data_source: string | null
  calculation_method: string | null
  frequency: string
  rationale: string | null
  baseline: number | null
  target: number | null
  is_priority: boolean
  tier_id: string | null
  objective_id: string | null
  owner_id: string | null
  project_id: string | null
  created_at: string
  updated_at: string
  tier: { name: string } | null
  objective: { name: string } | null
  owner: { full_name: string | null; email: string | null } | null
  project: { id: string; name: string } | null
  readings: KpiReading[]
  action_plans: KpiActionPlan[]
}

export interface KpiInput {
  name: string
  description?: string | null
  pillar?: string | null
  entity?: string | null
  unit?: string | null
  polarity?: string
  decimal_places?: number
  data_source?: string | null
  calculation_method?: string | null
  frequency?: string
  rationale?: string | null
  baseline?: number | null
  target?: number | null
  is_priority?: boolean
  tier_id?: string | null
  objective_id?: string | null
  owner_id?: string | null
  project_id?: string | null
}

export interface AdminUser {
  id: string
  email: string | null
  full_name: string | null
  app_role: 'admin' | 'pmo' | 'executive' | 'user'
}

export interface CapabilityInfo {
  key: string
  label: string
  description: string
}

export interface CapabilityGrants {
  catalog: CapabilityInfo[]
  grants: Record<'pmo' | 'executive' | 'user', string[]>
}

export const accessApi = {
  users: () => apiGet<AdminUser[]>('/access/users'),
  updateRole: (id: string, app_role: string) =>
    apiPatch<{ id: string; app_role: string }>(`/access/users/${id}/role`, {
      app_role,
    }),
  capabilities: () => apiGet<CapabilityGrants>('/access/capabilities'),
  saveGrants: (role: string, capabilities: string[]) =>
    apiPut<CapabilityGrants>(`/access/capabilities/${role}`, { capabilities }),
}

export interface AdminLookupRow {
  id: string
  name: string
  sort_order: number | null
  is_active: boolean
  color?: string | null
  rank?: number | null
  default_access_level?: string
  objective_id?: string | null
}

export interface AdminLookupTable {
  rows: AdminLookupRow[]
  extras: string[]
}

export const adminLookupsApi = {
  listAll: () => apiGet<Record<string, AdminLookupTable>>('/lookups'),
  add: (
    name: string,
    body: { name: string; sort_order?: number },
  ) => apiPost<AdminLookupRow>(`/lookups/${name}/values`, body),
  update: (
    name: string,
    id: string,
    body: {
      name?: string
      sort_order?: number
      is_active?: boolean
      color?: string | null
      rank?: number
      default_access_level?: string
    },
  ) => apiPatch<AdminLookupRow>(`/lookups/${name}/values/${id}`, body),
}

export type SearchKind =
  | 'project'
  | 'milestone'
  | 'action_item'
  | 'issue'
  | 'risk'
  | 'kpi'

export interface SearchHit {
  kind: SearchKind
  id: string
  label: string
  project_id: string | null
  project_name: string | null
}

export interface SavedSearch {
  id: string
  name: string
  query: string
  created_at: string
}

export const searchApi = {
  query: (q: string) =>
    apiGet<{ query: string; hits: SearchHit[] }>(
      `/search?q=${encodeURIComponent(q)}`,
    ),
  saved: () => apiGet<SavedSearch[]>('/search/saved'),
  save: (name: string, query: string) =>
    apiPost<SavedSearch>('/search/saved', { name, query }),
  removeSaved: (savedSearchId: string) =>
    apiDelete<{ deleted: boolean }>(`/search/saved/${savedSearchId}`),
}

export interface GlobalMilestone {
  id: string
  project_id: string
  name: string
  due_date: string | null
  status: string
  is_major: boolean
  weightage: number | null
  percent_complete: number | null
  completed_date: string | null
  tags: string[] | null
  project: { name: string } | null
  owner: { full_name: string | null; email: string | null } | null
  outcome: { name: string } | null
}

export interface GlobalActionItem {
  id: string
  project_id: string
  title: string
  due_date: string | null
  status: string
  tags: string[] | null
  project: { name: string } | null
  type: { name: string } | null
  owners: Array<{
    slot: number
    user_id: string
    profile: { full_name: string | null; email: string | null } | null
  }>
}

export interface DirectoryMembership {
  project_id: string
  project_name: string | null
  role: string | null
  access_level: string
  status: string
}

export interface DirectoryPerson {
  key: string
  user_id: string | null
  name: string
  email: string | null
  pending: boolean
  memberships: DirectoryMembership[]
}

export const registryApi = {
  milestones: () => apiGet<GlobalMilestone[]>('/milestones'),
  actionItems: () => apiGet<GlobalActionItem[]>('/action-items'),
  people: () => apiGet<DirectoryPerson[]>('/people'),
}

export interface ImportRowResult {
  row: number
  name: string
  status: 'created' | 'failed'
  error?: string
}

export interface ImportSummary {
  created: number
  failed: number
  results: ImportRowResult[]
}

export const importApi = {
  projects: (rows: Array<Record<string, string>>) =>
    apiPost<ImportSummary>('/import/projects', { rows }),
  milestones: (rows: Array<Record<string, string>>) =>
    apiPost<ImportSummary>('/import/milestones', { rows }),
}

export interface ProjectTemplate {
  id: string
  name: string
  description: string | null
  created_at: string
  outcome_count: number
  milestone_count: number
}

export const templatesApi = {
  list: () => apiGet<ProjectTemplate[]>('/templates'),
  save: (name: string, description: string | null, projectId: string) =>
    apiPost<ProjectTemplate>('/templates', {
      name,
      description,
      project_id: projectId,
    }),
  remove: (templateId: string) =>
    apiDelete<{ deleted: boolean }>(`/templates/${templateId}`),
  instantiate: (
    templateId: string,
    body: { name: string; start_date?: string; target_end_date?: string },
  ) =>
    apiPost<{ project_id: string; name: string }>(
      `/templates/${templateId}/instantiate`,
      body,
    ),
}

export const kpisApi = {
  list: () => apiGet<Kpi[]>('/kpis'),
  add: (body: KpiInput) => apiPost<Kpi>('/kpis', body),
  update: (kpiId: string, body: Partial<KpiInput>) =>
    apiPatch<Kpi>(`/kpis/${kpiId}`, body),
  remove: (kpiId: string) => apiDelete(`/kpis/${kpiId}`),
  addReading: (
    kpiId: string,
    body: {
      reading_date: string
      value: number
      performance_analysis?: string | null
    },
  ) => apiPost<KpiReading>(`/kpis/${kpiId}/readings`, body),
  removeReading: (kpiId: string, readingId: string) =>
    apiDelete(`/kpis/${kpiId}/readings/${readingId}`),
  addPlan: (
    kpiId: string,
    body: {
      description: string
      owner?: string | null
      due_date?: string | null
      status?: string
    },
  ) => apiPost<KpiActionPlan>(`/kpis/${kpiId}/plans`, body),
  updatePlan: (
    kpiId: string,
    planId: string,
    body: { description?: string; owner?: string | null; due_date?: string | null; status?: string },
  ) => apiPatch<{ ok: boolean }>(`/kpis/${kpiId}/plans/${planId}`, body),
  removePlan: (kpiId: string, planId: string) =>
    apiDelete(`/kpis/${kpiId}/plans/${planId}`),
}
