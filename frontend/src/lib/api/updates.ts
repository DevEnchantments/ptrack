import { apiDelete, apiGet, apiPatch, apiPost } from './core'

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
