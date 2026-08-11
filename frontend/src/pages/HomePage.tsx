import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  CircleAlert,
  Download,
  Flag,
  LayoutGrid,
  Lock,
  Search,
  Star,
  Table as TableIcon,
  TriangleAlert,
} from 'lucide-react'
import {
  projectsApi,
  lookupsApi,
  type ProjectListItem,
  type Lookup,
} from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { StatusPill } from '@/components/StatusPill'
import { ProjectsGrid } from '@/components/ProjectsGrid'
import { type GridSort, type GridSortKey } from '@/lib/project-grid'
import { buildCsv, downloadCsv } from '@/lib/csv'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { usePageTitle } from '@/lib/use-page-title'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const ALL = '__all__'
const UNKNOWN_STATUS = '__unknown__'
const PHASE2_TOOLTIP = 'Coming in Phase 2'

const SORTS = [
  { label: 'Last Updated Descending', value: 'updated_desc' },
  { label: 'Last Updated Ascending', value: 'updated_asc' },
  { label: 'Name A–Z', value: 'name_asc' },
  { label: 'Name Z–A', value: 'name_desc' },
]

const ROWS_OPTIONS = [
  { label: 'All', value: 'all' },
  { label: '12', value: '12' },
  { label: '24', value: '24' },
  { label: '48', value: '48' },
]

function relativeTime(iso: string): string {
  const sec = Math.round((Date.now() - new Date(iso).getTime()) / 1000)
  if (sec < 60) return 'just now'
  const min = Math.round(sec / 60)
  if (min < 60) return `${min} minute${min === 1 ? '' : 's'} ago`
  const hr = Math.round(min / 60)
  if (hr < 24) return `${hr} hour${hr === 1 ? '' : 's'} ago`
  const day = Math.round(hr / 24)
  if (day < 30) return `${day} day${day === 1 ? '' : 's'} ago`
  const mo = Math.round(day / 30)
  if (mo < 12) return `${mo} month${mo === 1 ? '' : 's'} ago`
  const yr = Math.round(mo / 12)
  return `${yr} year${yr === 1 ? '' : 's'} ago`
}

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** Flips true one frame after mount so the milestone bars sweep in (starts true on reduced motion). */
function useEntranceFlag(): boolean {
  const [entered, setEntered] = useState(() => prefersReducedMotion())
  useEffect(() => {
    const raf = requestAnimationFrame(() =>
      requestAnimationFrame(() => setEntered(true)),
    )
    return () => cancelAnimationFrame(raf)
  }, [])
  return entered
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[1][0]).toUpperCase()
}

export function HomePage() {
  usePageTitle('Projects')
  const navigate = useNavigate()
  const [projects, setProjects] = useState<ProjectListItem[]>([])
  const entered = useEntranceFlag()
  const [view, setView] = useState<'cards' | 'grid'>(
    () => (localStorage.getItem('ptrack:home-view') === 'grid' ? 'grid' : 'cards'),
  )
  const [gridSort, setGridSort] = useState<GridSort>({
    key: 'name',
    dir: 'asc',
  })
  const [exportOpen, setExportOpen] = useState(false)

  function switchView(v: 'cards' | 'grid') {
    setView(v)
    try {
      localStorage.setItem('ptrack:home-view', v)
    } catch {
      /* storage unavailable — the toggle still works this session */
    }
  }

  function toggleGridSort(key: GridSortKey) {
    setGridSort((cur) =>
      cur.key === key
        ? { key, dir: cur.dir === 'asc' ? 'desc' : 'asc' }
        : { key, dir: 'asc' },
    )
  }

  function exportCsv(rows: typeof projects) {
    const csv = buildCsv(
      [
        'Name', 'Reference ID', 'Project Number', 'Plan Year', 'Status',
        'Tier', 'Sector', 'Owner', 'Project Manager', 'Sponsor',
        'Start Date', 'End Date', 'Manual %', 'Calculated %', 'Planned %',
        'At Risk', 'Priority', 'Approved Budget', 'Utilized Budget',
        'Milestones Done', 'Milestones Total', 'Open Issues',
      ],
      rows.map((p) => [
        p.name, p.reference_id, p.project_number, p.plan_year,
        p.status?.name ?? '', p.tier?.name ?? '', p.sector?.name ?? '',
        p.owner?.full_name ?? p.owner?.email ?? '',
        p.project_manager?.full_name ?? p.project_manager?.email ?? '',
        p.sponsor, p.start_date, p.target_end_date, p.manual_progress,
        p.calculated_progress, p.planned_progress,
        p.at_risk ? 'Yes' : 'No', p.is_priority ? 'Yes' : 'No',
        p.approved_budget, p.utilized_budget, p.milestones_done,
        p.milestones_total, p.open_issues,
      ]),
    )
    downloadCsv(
      `ptrack-projects-${new Date().toISOString().slice(0, 10)}.csv`,
      csv,
    )
    setExportOpen(false)
  }
  const [statuses, setStatuses] = useState<Lookup[]>([])
  const [sizes, setSizes] = useState<Lookup[]>([])
  const [categories, setCategories] = useState<Lookup[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filter rail state (mirrors the demo's left rail). `unchecked === null`
  // means "demo default": every status on except Complete.
  const [search, setSearch] = useState('')
  const [unchecked, setUnchecked] = useState<string[] | null>(null)
  const [sizeId, setSizeId] = useState(ALL)
  // Seeded from ?category= so the Categories page (and shared links) can
  // open the register pre-filtered.
  const [searchParams] = useSearchParams()
  const [categoryId, setCategoryId] = useState(
    searchParams.get('category') ?? ALL,
  )
  const [sort, setSort] = useState('updated_desc')
  const [rows, setRows] = useState('all')

  useEffect(() => {
    Promise.all([
      projectsApi.list(),
      lookupsApi.list('project-statuses'),
      lookupsApi.list('project-sizes'),
      lookupsApi.list('project-categories'),
    ])
      .then(([p, s, sz, c]) => {
        setProjects(p)
        setStatuses(s)
        setSizes(sz)
        setCategories(c)
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const statusName = useMemo(() => {
    const map = new Map(statuses.map((s) => [s.id, s.name]))
    return (id: string | null) => (id ? (map.get(id) ?? null) : null)
  }, [statuses])

  // Projects with no (or unmapped) status fall into a synthetic Unknown bucket.
  const knownIds = new Set(statuses.map((s) => s.id))
  const bucketOf = (p: ProjectListItem) =>
    p.status_id && knownIds.has(p.status_id) ? p.status_id : UNKNOWN_STATUS

  const counts = new Map<string, number>()
  for (const p of projects) {
    const b = bucketOf(p)
    counts.set(b, (counts.get(b) ?? 0) + 1)
  }

  const defaultUnchecked = statuses
    .filter((s) => s.name.trim().toLowerCase() === 'complete')
    .map((s) => s.id)
  const uncheckedEff = unchecked ?? defaultUnchecked

  const statusChecks: Array<{ id: string; name: string }> = [
    ...statuses.map((s) => ({ id: s.id, name: s.name })),
    ...((counts.get(UNKNOWN_STATUS) ?? 0) > 0
      ? [{ id: UNKNOWN_STATUS, name: 'Unknown' }]
      : []),
  ]

  function toggleStatus(id: string) {
    setUnchecked((cur) => {
      const eff = cur ?? defaultUnchecked
      return eff.includes(id) ? eff.filter((x) => x !== id) : [...eff, id]
    })
  }

  const q = search.trim().toLowerCase()
  const filtered = projects
    .filter(
      (p) =>
        !uncheckedEff.includes(bucketOf(p)) &&
        (q === '' ||
          p.name.toLowerCase().includes(q) ||
          (p.description ?? '').toLowerCase().includes(q)) &&
        (sizeId === ALL || p.size_id === sizeId) &&
        (categoryId === ALL || p.category_id === categoryId),
    )
    .sort((a, b) => {
      switch (sort) {
        case 'updated_asc':
          return a.updated_at.localeCompare(b.updated_at)
        case 'name_asc':
          return a.name.localeCompare(b.name)
        case 'name_desc':
          return b.name.localeCompare(a.name)
        default:
          return b.updated_at.localeCompare(a.updated_at)
      }
    })
  const visible = rows === 'all' ? filtered : filtered.slice(0, Number(rows))

  // Remounting the grid on any filter change replays the card stagger.
  const filterKey = [
    q,
    uncheckedEff.join(','),
    sizeId,
    categoryId,
    sort,
    rows,
  ].join('|')

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
              <div key={i} className="rounded-lg border bg-card p-5 shadow-xs">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-9 w-9 rounded-full" />
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="mt-2 h-4 w-4/5" />
                <Skeleton className="mt-4 h-1.5 w-full rounded-full" />
                <Skeleton className="mt-4 h-3 w-32" />
              </div>
            ))}
          </div>
        )}

        {!loading && error && (
          <div>
            <p className="text-destructive">{error}</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Reload
            </Button>
          </div>
        )}

        {!loading && !error && projects.length === 0 && (
          <div className="rounded-md border border-dashed p-10 text-center text-muted-foreground">
            No projects yet. Click{' '}
            <span className="font-medium text-foreground">Create Project</span>{' '}
            to add one.
          </div>
        )}

        {!loading && !error && projects.length > 0 && (
          <div className="flex flex-col gap-6 lg:flex-row">
            {/* Filter rail — mirrors the demo's left rail. */}
            <aside className="animate-step-in w-full shrink-0 space-y-5 lg:w-60">
              <div className="relative">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search Projects"
                  className="pl-8"
                />
              </div>

              <div>
                <p className="mb-2 text-sm font-medium">Status</p>
                <ul className="space-y-1.5">
                  {statusChecks.map((s) => (
                    <li key={s.id}>
                      <label className="flex cursor-pointer items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded accent-primary"
                          checked={!uncheckedEff.includes(s.id)}
                          onChange={() => toggleStatus(s.id)}
                        />
                        <span className="flex-1">{s.name}</span>
                        <span className="text-xs tabular-nums text-muted-foreground">
                          {counts.get(s.id) ?? 0}
                        </span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="mb-2 text-sm font-medium">Size</p>
                <Select
                  items={[
                    { label: '- All Sizes -', value: ALL },
                    ...sizes.map((s) => ({ label: s.name, value: s.id })),
                  ]}
                  value={sizeId}
                  onValueChange={(v) => setSizeId(v ?? ALL)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ALL}>- All Sizes -</SelectItem>
                    {sizes.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div title={PHASE2_TOOLTIP}>
                <p className="mb-2 text-sm font-medium text-muted-foreground">
                  Project Person
                </p>
                <Select items={[{ label: '- All People -', value: ALL }]} value={ALL}>
                  <SelectTrigger className="w-full" disabled>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ALL}>- All People -</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <p className="mb-2 text-sm font-medium">Category</p>
                <Select
                  items={[
                    { label: '- All Categories -', value: ALL },
                    ...categories.map((c) => ({ label: c.name, value: c.id })),
                  ]}
                  value={categoryId}
                  onValueChange={(v) => setCategoryId(v ?? ALL)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ALL}>- All Categories -</SelectItem>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div title={PHASE2_TOOLTIP}>
                <p className="mb-2 text-sm font-medium text-muted-foreground">
                  Following
                </p>
                <label className="flex cursor-not-allowed items-center gap-2 text-sm text-muted-foreground">
                  <input type="checkbox" disabled className="h-4 w-4 rounded" />
                  Projects I'm Following
                </label>
              </div>

              <div>
                <p className="mb-2 text-sm font-medium">Sort</p>
                <Select
                  items={SORTS}
                  value={sort}
                  onValueChange={(v) => setSort(v ?? 'updated_desc')}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SORTS.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <p className="mb-2 text-sm font-medium">Rows</p>
                <Select
                  items={ROWS_OPTIONS}
                  value={rows}
                  onValueChange={(v) => setRows(v ?? 'all')}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ROWS_OPTIONS.map((r) => (
                      <SelectItem key={r.value} value={r.value}>
                        {r.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </aside>

            <div className="min-w-0 flex-1">
              <div className="mb-4 flex items-center justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setExportOpen(true)}
                  disabled={visible.length === 0}
                >
                  <Download className="h-4 w-4" />
                  Export
                </Button>
                <div className="flex rounded-md border">
                  <button
                    type="button"
                    aria-label="Card view"
                    aria-pressed={view === 'cards'}
                    onClick={() => switchView('cards')}
                    className={`rounded-l-[7px] p-1.5 transition-colors ${
                      view === 'cards'
                        ? 'bg-secondary text-secondary-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    aria-label="Grid view"
                    aria-pressed={view === 'grid'}
                    onClick={() => switchView('grid')}
                    className={`rounded-r-[7px] p-1.5 transition-colors ${
                      view === 'grid'
                        ? 'bg-secondary text-secondary-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <TableIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
              {visible.length === 0 ? (
                <div className="rounded-md border border-dashed p-10 text-center text-muted-foreground">
                  No projects match the current filters.
                </div>
              ) : (
              view === 'grid' ? (
                <ProjectsGrid
                  projects={visible}
                  sort={gridSort}
                  onSort={toggleGridSort}
                  onOpen={(pid) => navigate(`/projects/${pid}`)}
                />
              ) : (
                <div
                  key={filterKey}
                  className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
                >
                  {visible.map((p, i) => {
                    const status = statusName(p.status_id)
                    return (
                      <div
                        key={p.id}
                        onClick={() => navigate(`/projects/${p.id}`)}
                        role="link"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') navigate(`/projects/${p.id}`)
                        }}
                        style={{ animationDelay: `${Math.min(i, 12) * 30}ms` }}
                        className="stagger-in flex cursor-pointer flex-col rounded-lg border bg-card p-5 shadow-xs transition-[translate,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-2 focus-visible:outline-ring"
                      >
                        <div className="mb-2 flex items-start justify-between gap-3">
                          <h2 className="text-base font-semibold">
                            {p.is_priority && (
                              <Star className="mr-1 inline h-4 w-4 fill-gold text-gold" />
                            )}
                            {p.access_control === 'restricted' && (
                              <Lock className="mr-1 inline h-4 w-4 text-muted-foreground" />
                            )}
                            {p.at_risk && (
                              <TriangleAlert className="mr-1 inline h-4 w-4 text-destructive" />
                            )}
                            {p.name}
                          </h2>
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                            {initials(p.name)}
                          </span>
                        </div>
                        {status && (
                          <div className="mb-3">
                            <StatusPill status={status} />
                          </div>
                        )}
                        <p className="line-clamp-2 flex-1 text-sm text-muted-foreground">
                          {p.description ?? ''}
                        </p>
                        <div className="mt-3 mb-1 flex items-center justify-between text-xs text-muted-foreground">
                          <span>Progress</span>
                          <span className="font-medium text-foreground">
                            {p.calculated_progress ?? 0}%
                          </span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-primary transition-[width] duration-500 ease-out"
                            style={{
                              width:
                                entered && p.calculated_progress != null
                                  ? `${p.calculated_progress}%`
                                  : '0%',
                            }}
                          />
                        </div>
                        <div className="mt-3 flex items-center gap-4 border-t pt-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Flag className="h-3.5 w-3.5" />
                            {p.milestones_done}/{p.milestones_total}
                          </span>
                          <span className="flex items-center gap-1">
                            <CircleAlert className="h-3.5 w-3.5" />
                            {p.open_issues} open
                          </span>
                          {p.manual_progress != null && (
                            <span>Manual {p.manual_progress}%</span>
                          )}
                          <span className="ml-auto">
                            {relativeTime(p.updated_at)}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        )}

        <Dialog open={exportOpen} onOpenChange={setExportOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Download projects</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground">
              You are about to download {visible.length}{' '}
              {visible.length === 1 ? 'project record' : 'project records'} (the
              currently filtered list) as a CSV file readable by Excel.
            </p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setExportOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => exportCsv(visible)}>
                <Download className="h-4 w-4" />
                Download CSV
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
