import { apiDelete, apiGet, apiPatch, apiPost } from './core'

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
  update: (projectId: string, outcomeId: string, data: Record<string, unknown>) =>
    apiPatch<ProgramOutcome>(`/projects/${projectId}/outcomes/${outcomeId}`, data),
  remove: (projectId: string, outcomeId: string) =>
    apiDelete<{ deleted: boolean }>(`/projects/${projectId}/outcomes/${outcomeId}`),
}

export interface Milestone {
  id: string
  project_id: string
  name: string
  description: string | null
  start_date: string | null
  due_date: string | null
  original_due_date: string | null
  completed_date: string | null
  depends_on?: Array<{ source_id: string }> | null
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
