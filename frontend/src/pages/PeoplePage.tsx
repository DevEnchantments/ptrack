import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { registryApi, type DirectoryPerson } from '@/lib/api'
import { usePageTitle } from '@/lib/use-page-title'
import { InitialsAvatar } from '@/components/InitialsAvatar'
import { CreateAccountDialog } from '@/components/CreateAccountDialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

/** People directory: everyone assigned to any project, real or pending. */
export function PeoplePage() {
  usePageTitle('People')
  const navigate = useNavigate()

  const [people, setPeople] = useState<DirectoryPerson[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const [accountFor, setAccountFor] = useState<DirectoryPerson | null>(null)

  const load = useCallback(() => {
    registryApi
      .people()
      .then(setPeople)
      .catch((e) => setError((e as Error).message))
      .finally(() => setLoading(false))
  }, [])

  useEffect(load, [load])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (q === '') return people
    return people.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.email ?? '').toLowerCase().includes(q) ||
        p.memberships.some((m) =>
          (m.project_name ?? '').toLowerCase().includes(q),
        ),
    )
  }, [people, search])

  function toggle(key: string) {
    setExpanded((cur) => {
      const next = new Set(cur)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Portfolio
      </p>
      <h1 className="text-2xl font-semibold">People</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Everyone assigned to a project, with their memberships and roles.
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Input
          className="h-9 w-72"
          placeholder="Search by name, email, or project…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {!loading && !error && (
          <span className="ml-auto text-xs text-muted-foreground">
            {filtered.length} of {people.length}
          </span>
        )}
      </div>

      {loading ? (
        <div className="mt-6 flex flex-col gap-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-14 animate-pulse rounded-lg border bg-card" />
          ))}
        </div>
      ) : error ? (
        <p className="mt-6 text-sm font-medium text-destructive">
          Could not load people: {error}
        </p>
      ) : filtered.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">Nobody matches.</p>
      ) : (
        <ul className="section-list mt-6 flex flex-col gap-2">
          {filtered.map((p) => {
            const isOpen = expanded.has(p.key)
            return (
              <li
                key={p.key}
                className="overflow-hidden rounded-lg border bg-card shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => toggle(p.key)}
                  aria-expanded={isOpen}
                  className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left hover:bg-accent focus-visible:outline-2 focus-visible:outline-ring"
                >
                  {isOpen ? (
                    <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                  )}
                  <InitialsAvatar name={p.name} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">
                      {p.name}
                      {p.pending && (
                        <span className="ml-2 text-xs font-normal text-[var(--status-amber-fg)]">
                          (pending)
                        </span>
                      )}
                    </span>
                    {p.email && (
                      <span className="block truncate text-xs text-muted-foreground">
                        {p.email}
                      </span>
                    )}
                  </span>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {p.memberships.length} project
                    {p.memberships.length === 1 ? '' : 's'}
                  </span>
                </button>
                {isOpen && p.pending && (
                  <div className="border-t bg-muted/30 px-4 py-2 pl-14">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setAccountFor(p)}
                    >
                      Create account
                    </Button>
                  </div>
                )}
                {isOpen && (
                  <ul className="divide-y border-t bg-muted/30">
                    {p.memberships.map((m) => (
                      <li key={`${p.key}-${m.project_id}`}>
                        <button
                          type="button"
                          onClick={() => navigate(`/projects/${m.project_id}`)}
                          className="flex w-full cursor-pointer items-center gap-3 px-4 py-2 pl-14 text-left text-sm hover:bg-accent focus-visible:outline-2 focus-visible:outline-ring"
                        >
                          <span className="min-w-0 flex-1 truncate">
                            {m.project_name ?? 'Unknown project'}
                          </span>
                          {m.role && (
                            <span className="text-xs text-muted-foreground">
                              {m.role}
                            </span>
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            )
          })}
        </ul>
      )}

      <CreateAccountDialog
        open={accountFor !== null}
        onOpenChange={(o) => {
          if (!o) setAccountFor(null)
        }}
        person={{
          name: accountFor?.name ?? '',
          email: accountFor?.email ?? null,
        }}
        onProvisioned={load}
      />
    </div>
  )
}
