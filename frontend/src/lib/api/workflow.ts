import { apiGet, apiPost } from './core'

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

export interface DashboardChartPoint {
  label: string
  value: number
}

export interface DashboardData {
  stats: {
    active_projects: number
    projects_created_this_month: number
    open_action_items: number
    action_items_due_this_week: number
    milestones_this_month: number
    major_milestones_this_month: number
    overdue_items: number
  }
  updates_per_week: DashboardChartPoint[]
  projects_by_status: DashboardChartPoint[]
  action_items: { open: number; closed: number; overdue: number }
  projects_by_category: DashboardChartPoint[]
  milestones_per_month: DashboardChartPoint[]
  flow: { labels: string[]; created: number[]; completed: number[] }
  overall_milestones: { done: number; total: number }
  heat: number[][]
  executive: {
    initiative_buckets: DashboardChartPoint[]
    budget: { approved: number; utilized: number }
    submissions: DashboardChartPoint[]
    monthly: Array<{ label: string; done: number; total: number }>
  }
}

export const dashboardApi = {
  get: () => apiGet<DashboardData>('/dashboard'),
}

export interface InitiativeProgressRow {
  project_id: string
  name: string
  reference_id: string | null
  owner: string | null
  project_manager: string | null
  status: string | null
  start_date: string | null
  target_end_date: string | null
  planned: number | null
  calculated: number | null
  delta: number | null
  bucket: string | null
  milestones_done: number
  milestones_total: number
}

export interface MonthlyPerformanceMonth {
  label: string
  due: number
  done: number
  completed: number
  submitted: number
  approved: number
}

export const reportsApi = {
  cycleStatus: () => apiGet<CycleStatusReport>('/reports/cycle-status'),
  initiativeProgress: () =>
    apiGet<{ rows: InitiativeProgressRow[] }>('/reports/initiative-progress'),
  monthlyPerformance: (year: number) =>
    apiGet<{ year: number; months: MonthlyPerformanceMonth[] }>(
      `/reports/monthly-performance?year=${year}`,
    ),
}

export const cyclesApi = {
  current: () => apiGet<{ cycle: Cycle | null }>('/cycles/current'),
  close: () => apiPost<Cycle>('/cycles/current/close', {}),
  reopen: () => apiPost<Cycle>('/cycles/current/reopen', {}),
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
