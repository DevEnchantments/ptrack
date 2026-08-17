import { apiDelete, apiGet, apiPatch, apiPost } from './core'

export interface UserSummary {
  id: string
  full_name: string | null
  email: string | null
}

export type AppRole = 'admin' | 'pmo' | 'executive' | 'user'

export interface Me {
  id: string
  email: string | null
  app_role: AppRole
  capabilities: string[]
}

export const usersApi = {
  search: (query: string) =>
    apiGet<UserSummary[]>(`/users?search=${encodeURIComponent(query)}`),
  me: () => apiGet<Me>('/users/me'),
  provision: (body: { email: string; full_name: string; password: string }) =>
    apiPost<{
      user_id: string
      email: string
      full_name: string
      claimed: number
    }>('/users/provision', body),
  claim: () => apiPost<{ claimed: number }>('/users/claim', {})
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
