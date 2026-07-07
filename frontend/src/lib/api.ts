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

export interface Project {
  id: string
  name: string
  parent_project_id: string | null
  start_date: string | null
  created_by: string | null
  created_at: string
}

export const projectsApi = {
  list: () => apiGet<Project[]>('/projects'),
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