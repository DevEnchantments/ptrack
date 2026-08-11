import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AlertTriangle,
  Bookmark,
  BookmarkPlus,
  Flag,
  Folder,
  Gauge,
  Home,
  LayoutDashboard,
  ListChecks,
  Loader2,
  Plus,
  Search,
  ShieldAlert,
  X,
} from 'lucide-react'
import {
  searchApi,
  type SavedSearch,
  type SearchHit,
  type SearchKind,
} from '@/lib/api'
import { toast } from '@/lib/toast'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface Entry {
  id: string
  label: string
  hint?: string
  icon: typeof Home
  run: () => void
  saved?: SavedSearch
}

const KIND_META: Record<SearchKind, { hint: string; icon: typeof Home }> = {
  project: { hint: 'Project', icon: Folder },
  milestone: { hint: 'Milestone', icon: Flag },
  action_item: { hint: 'Action Item', icon: ListChecks },
  issue: { hint: 'Issue', icon: AlertTriangle },
  risk: { hint: 'Risk', icon: ShieldAlert },
  kpi: { hint: 'KPI', icon: Gauge },
}

function hitPath(hit: SearchHit): string {
  switch (hit.kind) {
    case 'project':
      return `/projects/${hit.id}`
    case 'milestone':
      return `/projects/${hit.project_id}/milestones/${hit.id}`
    case 'action_item':
      return `/projects/${hit.project_id}/action-items/${hit.id}`
    case 'issue':
    case 'risk':
      return `/projects/${hit.project_id}`
    case 'kpi':
      return '/kpis'
  }
}

/** Ctrl/Cmd+K palette: global record search (server-backed), saved searches,
 *  and quick nav actions. Deliberately unanimated: keyboard-initiated and
 *  used constantly, so it must appear instantly (see UI-AUDIT). */
export function CommandPalette({ open, onOpenChange }: Props) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const [hits, setHits] = useState<SearchHit[]>([])
  const [searching, setSearching] = useState(false)
  const [saved, setSaved] = useState<SavedSearch[]>([])
  const [naming, setNaming] = useState(false)
  const [saveName, setSaveName] = useState('')
  const seq = useRef(0)

  // Reset + (re)load on open — render-phase prev-key pattern for the reset.
  const [prevOpen, setPrevOpen] = useState(open)
  if (prevOpen !== open) {
    setPrevOpen(open)
    if (open) {
      setQuery('')
      setActive(0)
      setHits([])
      setNaming(false)
      setSaveName('')
    }
  }

  useEffect(() => {
    if (!open) return
    searchApi
      .saved()
      .then(setSaved)
      .catch(() => setSaved([]))
  }, [open])

  // Query transitions are handled in render (prev-key pattern) so the effect
  // below only owns the debounce timer.
  const q = query.trim()
  const [prevQ, setPrevQ] = useState(q)
  if (prevQ !== q) {
    setPrevQ(q)
    if (q.length < 2) {
      setHits([])
      setSearching(false)
    } else {
      setSearching(true)
    }
  }

  // Debounced server search; stale responses dropped via sequence counter.
  useEffect(() => {
    if (!open || q.length < 2) return
    const mySeq = ++seq.current
    const timer = setTimeout(() => {
      searchApi
        .query(q)
        .then((r) => {
          if (seq.current !== mySeq) return
          setHits(r.hits)
          setSearching(false)
        })
        .catch(() => {
          if (seq.current !== mySeq) return
          setHits([])
          setSearching(false)
        })
    }, 200)
    return () => clearTimeout(timer)
  }, [open, q])

  if (!open) return null

  function go(to: string) {
    onOpenChange(false)
    navigate(to)
  }

  async function saveCurrent() {
    const name = saveName.trim() || q
    try {
      const row = await searchApi.save(name, q)
      setSaved((cur) => [row, ...cur])
      setNaming(false)
      setSaveName('')
      toast.success('Search saved.')
    } catch (e) {
      toast.error((e as Error).message)
    }
  }

  async function removeSaved(row: SavedSearch) {
    try {
      await searchApi.removeSaved(row.id)
      setSaved((cur) => cur.filter((s) => s.id !== row.id))
    } catch (e) {
      toast.error((e as Error).message)
    }
  }

  const ql = q.toLowerCase()
  const actions: Entry[] = [
    { id: 'nav-projects', label: 'Go to Projects', icon: Home, run: () => go('/') },
    {
      id: 'nav-dashboard',
      label: 'Go to My Dashboard',
      icon: LayoutDashboard,
      run: () => go('/dashboard'),
    },
    {
      id: 'nav-create',
      label: 'Create Project',
      icon: Plus,
      run: () => go('/projects/new'),
    },
  ].filter((a) => ql === '' || a.label.toLowerCase().includes(ql))

  const savedEntries: Entry[] =
    q === ''
      ? saved.map((s) => ({
          id: `saved-${s.id}`,
          label: s.name,
          hint: `"${s.query}"`,
          icon: Bookmark,
          run: () => setQuery(s.query),
          saved: s,
        }))
      : []

  const hitEntries: Entry[] = hits.map((h) => ({
    id: `${h.kind}-${h.id}`,
    label: h.label,
    hint: h.project_name
      ? `${KIND_META[h.kind].hint} · ${h.project_name}`
      : KIND_META[h.kind].hint,
    icon: KIND_META[h.kind].icon,
    run: () => go(hitPath(h)),
  }))

  const saveEntry: Entry[] =
    q.length >= 2
      ? [
          {
            id: 'save-search',
            label: naming ? 'Name this search:' : `Save this search…`,
            icon: BookmarkPlus,
            run: () => setNaming(true),
          },
        ]
      : []

  const entries = [...actions, ...savedEntries, ...hitEntries, ...saveEntry]
  const activeClamped = Math.min(active, Math.max(entries.length - 1, 0))

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-overlay pt-[15vh] backdrop-blur-xs"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onOpenChange(false)
      }}
    >
      <div className="w-full max-w-lg overflow-hidden rounded-xl border bg-popover shadow-2xl">
        <div className="flex items-center gap-2 border-b px-3">
          {searching ? (
            <Loader2 className="h-4 w-4 shrink-0 animate-spin text-muted-foreground" />
          ) : (
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          )}
          <input
            autoFocus
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setActive(0)
              setNaming(false)
            }}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') {
                e.preventDefault()
                setActive((a) => Math.min(a + 1, entries.length - 1))
              } else if (e.key === 'ArrowUp') {
                e.preventDefault()
                setActive((a) => Math.max(a - 1, 0))
              } else if (e.key === 'Enter') {
                e.preventDefault()
                entries[activeClamped]?.run()
              } else if (e.key === 'Escape') {
                onOpenChange(false)
              }
            }}
            placeholder="Search projects, milestones, action items, issues, risks, KPIs…"
            className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            aria-label="Global search"
          />
          <kbd className="rounded border bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
            Esc
          </kbd>
        </div>
        <ul className="max-h-72 overflow-y-auto p-1.5">
          {entries.length === 0 && (
            <li className="px-3 py-6 text-center text-sm text-muted-foreground">
              {q.length >= 2 && !searching
                ? 'No matches.'
                : 'Type at least two characters to search.'}
            </li>
          )}
          {entries.map((entry, i) => (
            <li key={entry.id} className="group relative">
              <button
                type="button"
                onClick={entry.run}
                onMouseEnter={() => setActive(i)}
                className={`flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm ${
                  i === activeClamped
                    ? 'bg-accent text-accent-foreground'
                    : 'text-foreground'
                }`}
              >
                <entry.icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="flex-1 truncate">{entry.label}</span>
                {entry.hint && (
                  <span
                    className={`truncate text-xs text-muted-foreground ${entry.saved ? 'group-hover:opacity-0' : ''}`}
                  >
                    {entry.hint}
                  </span>
                )}
              </button>
              {entry.saved && (
                <button
                  type="button"
                  aria-label={`Delete saved search ${entry.label}`}
                  onClick={() => void removeSaved(entry.saved as SavedSearch)}
                  className="absolute right-2 top-1/2 hidden -translate-y-1/2 cursor-pointer rounded p-1 text-muted-foreground hover:text-destructive group-hover:block"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </li>
          ))}
          {naming && (
            <li className="flex items-center gap-2 px-3 py-2">
              <Bookmark className="h-4 w-4 shrink-0 text-muted-foreground" />
              <input
                autoFocus
                value={saveName}
                onChange={(e) => setSaveName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    void saveCurrent()
                  } else if (e.key === 'Escape') {
                    setNaming(false)
                  }
                }}
                placeholder={`Name for "${q}"…`}
                className="h-8 w-full rounded border bg-transparent px-2 text-sm outline-none placeholder:text-muted-foreground"
                aria-label="Saved search name"
              />
            </li>
          )}
        </ul>
        <div className="flex items-center gap-4 border-t bg-muted/40 px-3 py-1.5 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <kbd className="rounded border bg-background px-1">↑↓</kbd> navigate
          </span>
          <span className="flex items-center gap-1">
            <kbd className="rounded border bg-background px-1">Enter</kbd> open
          </span>
          <span className="flex items-center gap-1">
            <kbd className="rounded border bg-background px-1">Esc</kbd> close
          </span>
        </div>
      </div>
    </div>
  )
}
