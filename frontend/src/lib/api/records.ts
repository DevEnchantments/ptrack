import { apiDelete, apiGet, apiPatch, apiPost } from './core'

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
