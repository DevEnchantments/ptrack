import { useEffect, useState } from 'react'
import { projectsApi } from '@/lib/api'

// Session-lived cache, one lookup per project (same convention as lookups).
const cache = new Map<string, number>()
const inflight = new Map<string, Promise<number>>()

function fetchLevel(projectId: string): Promise<number> {
  const running = inflight.get(projectId)
  if (running) return running
  const p = projectsApi
    .myAccess(projectId)
    .then((r) => {
      cache.set(projectId, r.level)
      return r.level
    })
    .finally(() => inflight.delete(projectId))
  inflight.set(projectId, p)
  return p
}

/**
 * The caller's effective access level on a project (0 none, 1 view, 2 write,
 * 3 manage), for gating affordances on detail pages that don't load the full
 * project. `null` while loading — treat as not-write, so controls start
 * grayed and enable once confirmed. UX only; the backend enforces.
 */
export function useProjectAccess(projectId: string | undefined): number | null {
  const [level, setLevel] = useState<number | null>(
    projectId ? (cache.get(projectId) ?? null) : null,
  )

  useEffect(() => {
    if (!projectId || cache.has(projectId)) return
    let alive = true
    fetchLevel(projectId)
      .then((l) => {
        if (alive) setLevel(l)
      })
      .catch(() => undefined)
    return () => {
      alive = false
    }
  }, [projectId])

  return level
}
