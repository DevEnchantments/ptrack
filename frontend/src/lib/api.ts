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
  access_control: string
  start_date: string | null
  created_by: string | null
  created_at: string
}

export interface ProjectMemberDetail {
  id: string
  user_id: string | null
  pending_name: string | null
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
  members: ProjectMemberDetail[]
}

export const projectsApi = {
  list: () => apiGet<Project[]>('/projects'),
  get: (id: string) => apiGet<ProjectDetail>(`/projects/${id}`),
  create: (data: Record<string, unknown>) =>
    apiPost<Project>('/projects', data),
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
}

export const lookupsApi = {
  list: (name: string) => apiGet<Lookup[]>(`/lookups/${name}`),
}

export const categoriesApi = {
  create: (name: string) =>
    apiPost<Lookup>('/lookups/project-categories', { name }),
}

export const rolesApi = {
  create: (name: string, default_access_level: string) =>
    apiPost<Lookup>('/lookups/project-roles', { name, default_access_level }),
}

export const peopleApi = {
  add: (projectId: string, data: Record<string, unknown>) =>
    apiPost<unknown>(`/projects/${projectId}/people`, data),
}

export interface Milestone {
  id: string
  project_id: string
  name: string
  description: string | null
  start_date: string | null
  due_date: string | null
  status: string
  role_id: string | null
  owner_id: string | null
  is_major: boolean
  tags: string[] | null
  weightage: number | null
  percent_complete: number | null
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

export const milestonesApi = {
  list: (projectId: string) =>
    apiGet<Milestone[]>(`/projects/${projectId}/milestones`),
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
}