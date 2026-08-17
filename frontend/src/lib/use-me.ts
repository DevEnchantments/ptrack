import { useEffect, useState } from 'react'
import { usersApi, type Me } from '@/lib/api'

// Module-level promise cache (same convention as lookupsApi): one fetch per
// session, shared by every component that asks.
let mePromise: Promise<Me> | null = null
let cached: Me | null = null

function fetchMe(): Promise<Me> {
  mePromise ??= usersApi
    .me()
    .then((me) => {
      cached = me
      return me
    })
    .catch((err: unknown) => {
      // Allow a retry on the next mount rather than caching the failure.
      mePromise = null
      throw err
    })
  return mePromise
}

/**
 * The signed-in user's identity + global role for gating affordances.
 * `null` while loading — treat as the least-privileged state, so admin
 * surfaces appear only after the role is confirmed (fail closed). The
 * backend enforces everything regardless; this is UX, not security.
 */
export function useMe(): Me | null {
  const [me, setMe] = useState<Me | null>(cached)

  useEffect(() => {
    if (cached) return
    let alive = true
    fetchMe()
      .then((m) => {
        if (alive) setMe(m)
      })
      .catch(() => undefined)
    return () => {
      alive = false
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
