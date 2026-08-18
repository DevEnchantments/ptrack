import { useEffect, useState } from 'react'
import { usersApi, type Me } from '@/lib/api'

// Session cache with subscribers, so a profile edit or a role change made in
// Users & Roles reaches every mounted component without a page reload.
let cached: Me | null = null
let cachedAt = 0
let inflight: Promise<Me> | null = null
const listeners = new Set<(me: Me) => void>()

const STALE_MS = 60_000

function fetchMe(): Promise<Me> {
  inflight ??= usersApi
    .me()
    .then((me) => {
      cached = me
      cachedAt = Date.now()
      for (const notify of listeners) notify(me)
      return me
    })
    .finally(() => {
      inflight = null
    })
  return inflight
}

/** Drop the cache and refetch — call after editing your own profile. */
export function refreshMe(): Promise<Me> {
  cached = null
  cachedAt = 0
  return fetchMe()
}

// Roles and grants are edited live in Users & Roles; revalidating on window
// focus means a promotion shows up on the next tab switch, not the next
// hard refresh.
if (typeof window !== 'undefined') {
  window.addEventListener('focus', () => {
    if (cached && Date.now() - cachedAt > STALE_MS) void fetchMe()
  })
}

/**
 * The signed-in user's identity, global role, and capability set for gating
 * affordances. `null` while loading — treat as the least-privileged state,
 * so gated surfaces appear only after the role is confirmed (fail closed).
 * The backend enforces everything regardless; this is UX, not security.
 */
export function useMe(): Me | null {
  const [me, setMe] = useState<Me | null>(cached)

  useEffect(() => {
    listeners.add(setMe)
    if (!cached) {
      fetchMe().catch(() => undefined)
    }
    return () => {
      listeners.delete(setMe)
    }
  }, [])

  return me
}

/** Capability check for grant-gated buttons (null me = not granted yet). */
export function hasCapability(me: Me | null, capability: string): boolean {
  return me?.capabilities.includes(capability) ?? false
}

/** Convenience rank check mirroring the backend's atLeastRole. */
const RANK: Record<string, number> = { user: 0, executive: 1, pmo: 2, admin: 3 }
export function atLeastRole(
  role: string | undefined | null,
  min: 'pmo' | 'admin',
): boolean {
  return RANK[role ?? 'user'] >= RANK[min]
}
