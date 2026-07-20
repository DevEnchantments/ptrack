import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Folder, Home, LayoutDashboard, Plus, Search } from 'lucide-react'
import { projectsApi, type Project } from '@/lib/api'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface Entry {
  id: string
  label: string
  hint?: string
  icon: typeof Home
  to: string
}

const ACTIONS: Entry[] = [
  { id: 'nav-projects', label: 'Go to Projects', icon: Home, to: '/' },
  {
    id: 'nav-dashboard',
    label: 'Go to My Dashboard',
    icon: LayoutDashboard,
    to: '/dashboard',
  },
  {
    id: 'nav-create',
    label: 'Create Project',
    icon: Plus,
    to: '/projects/new',
  },
]

/** Ctrl/Cmd+K palette: fuzzy-jump to a project or run a quick action. */
export function CommandPalette({ open, onOpenChange }: Props) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const [projects, setProjects] = useState<Project[]>([])

  // Reset + (re)load on open — render-phase prev-key pattern for the reset.
  const [prevOpen, setPrevOpen] = useState(open)
  if (prevOpen !== open) {
    setPrevOpen(open)
    if (open) {
      setQuery('')
      setActive(0)
    }
  }

  useEffect(() => {
    if (!open) return
    projectsApi
      .list()
      .then(setProjects)
      .catch(() => setProjects([]))
  }, [open])

  if (!open) return null

  const q = query.trim().toLowerCase()
  const actionHits = ACTIONS.filter((a) => a.label.toLowerCase().includes(q))
  const projectHits: Entry[] = projects
    .filter((p) => q === '' || p.name.toLowerCase().includes(q))
    .slice(0, 8)
    .map((p) => ({
      id: p.id,
      label: p.name,
      hint: 'Project',
      icon: Folder,
      to: `/projects/${p.id}`,
    }))
  const entries = [...actionHits, ...projectHits]
  const activeClamped = Math.min(active, Math.max(entries.length - 1, 0))

  function run(entry: Entry | undefined) {
    if (!entry) return
    onOpenChange(false)
    navigate(entry.to)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/20 pt-[15vh] backdrop-blur-xs"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onOpenChange(false)
      }}
    >
      <div className="animate-in fade-in-0 zoom-in-95 w-full max-w-lg overflow-hidden rounded-xl border bg-popover shadow-2xl duration-100">
        <div className="flex items-center gap-2 border-b px-3">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          <input
            autoFocus
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setActive(0)
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
                run(entries[activeClamped])
              } else if (e.key === 'Escape') {
                onOpenChange(false)
              }
            }}
            placeholder="Search projects or type a command…"
            className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            aria-label="Command palette search"
          />
          <kbd className="rounded border bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
            Esc
          </kbd>
        </div>
        <ul className="max-h-72 overflow-y-auto p-1.5">
          {entries.length === 0 && (
            <li className="px-3 py-6 text-center text-sm text-muted-foreground">
              No matches.
            </li>
          )}
          {entries.map((entry, i) => (
            <li key={entry.id}>
              <button
                type="button"
                onClick={() => run(entry)}
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
                  <span className="text-xs text-muted-foreground">
                    {entry.hint}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
