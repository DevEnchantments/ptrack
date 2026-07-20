import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { projectsApi, lookupsApi, type Project, type Lookup } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { StatusPill } from '@/components/StatusPill'
import { usePageTitle } from '@/lib/use-page-title'

function initials(name: string) {
  const parts = name.trim().split(/\s+/)
  const letters = (parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')
  return letters.toUpperCase() || '?'
}

export function HomePage() {
  usePageTitle('Projects')
  const navigate = useNavigate()
  const [projects, setProjects] = useState<Project[]>([])
  const [statuses, setStatuses] = useState<Lookup[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([projectsApi.list(), lookupsApi.list('project-statuses')])
      .then(([p, s]) => {
        setProjects(p)
        setStatuses(s)
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const statusName = useMemo(() => {
    const map = new Map(statuses.map((s) => [s.id, s.name]))
    return (id: string | null) => (id ? (map.get(id) ?? null) : null)
  }, [statuses])

  return (
    <div className="min-h-svh">
      <header className="flex items-center justify-between border-b px-6 py-4">
        <div>
          <h1 className="text-lg font-semibold">P-Track</h1>
          <p className="text-sm text-muted-foreground">
            Collaboratively track projects, milestones, and action items.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button onClick={() => navigate('/projects/new')}>
            Create Project
          </Button>
        </div>
      </header>

      <main className="p-6">
        {loading && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="rounded-lg border bg-card p-5">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-9 w-9 rounded-full" />
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="mt-2 h-4 w-4/5" />
                <Skeleton className="mt-5 h-3 w-24" />
              </div>
            ))}
          </div>
        )}

        {error && (
          <p className="text-destructive">Couldn't load projects: {error}</p>
        )}

        {!loading && !error && projects.length === 0 && (
          <div className="rounded-md border border-dashed p-10 text-center text-muted-foreground">
            No projects yet. Click{' '}
            <span className="font-medium text-foreground">Create Project</span>{' '}
            to add one.
          </div>
        )}

        {!loading && !error && projects.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => {
              const status = statusName(p.status_id)
              return (
                <div
                  key={p.id}
                  onClick={() => navigate(`/projects/${p.id}`)}
                  className="flex cursor-pointer flex-col rounded-lg border bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <h2 className="text-base font-semibold">{p.name}</h2>
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                      {initials(p.name)}
                    </span>
                  </div>
                  {status && (
                    <div className="mb-2">
                      <StatusPill status={status} />
                    </div>
                  )}
                  <p className="flex-1 text-sm text-muted-foreground">
                    {p.description ?? ''}
                  </p>
                  <p className="mt-4 text-xs text-muted-foreground">
                    {p.access_control === 'restricted'
                      ? 'Restricted Access'
                      : 'Open Access'}
                  </p>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}