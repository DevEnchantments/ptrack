import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Folder } from 'lucide-react'
import { lookupsApi, projectsApi, type Lookup, type ProjectListItem } from '@/lib/api'
import { usePageTitle } from '@/lib/use-page-title'

/** Category browser: project counts per category, drilling into the
 *  register pre-filtered via ?category=. */
export function CategoriesPage() {
  usePageTitle('Categories')
  const navigate = useNavigate()

  const [projects, setProjects] = useState<ProjectListItem[]>([])
  const [categories, setCategories] = useState<Lookup[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([projectsApi.list(), lookupsApi.list('project-categories')])
      .then(([p, c]) => {
        setProjects(p)
        setCategories(c)
      })
      .catch((e) => setError((e as Error).message))
      .finally(() => setLoading(false))
  }, [])

  const counts = useMemo(() => {
    const map = new Map<string, number>()
    for (const p of projects) {
      if (p.category_id) map.set(p.category_id, (map.get(p.category_id) ?? 0) + 1)
    }
    return map
  }, [projects])

  const uncategorized = useMemo(
    () => projects.filter((p) => !p.category_id).length,
    [projects],
  )

  return (
    <div className="mx-auto max-w-4xl p-6">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Portfolio
      </p>
      <h1 className="text-2xl font-semibold">Categories</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Projects grouped by category. Pick one to open the register filtered
        to it.
      </p>

      {loading ? (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-lg border bg-card" />
          ))}
        </div>
      ) : error ? (
        <p className="mt-6 text-sm font-medium text-destructive">
          Could not load categories: {error}
        </p>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((c, i) => (
              <button
                key={c.id}
                type="button"
                onClick={() => navigate(`/?category=${c.id}`)}
                className="stagger-in flex cursor-pointer flex-col items-start gap-2 rounded-lg border bg-card p-5 text-left shadow-xs transition-[translate,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-2 focus-visible:outline-ring"
                style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }}
              >
                <Folder className="h-5 w-5 text-primary" />
                <span className="text-base font-semibold">{c.name}</span>
                <span className="text-sm text-muted-foreground">
                  {counts.get(c.id) ?? 0} project
                  {(counts.get(c.id) ?? 0) === 1 ? '' : 's'}
                </span>
              </button>
            ))}
          </div>
          {uncategorized > 0 && (
            <p className="mt-4 text-xs text-muted-foreground">
              {uncategorized} project{uncategorized === 1 ? '' : 's'} without a
              category (visible in the unfiltered register).
            </p>
          )}
        </>
      )}
    </div>
  )
}
