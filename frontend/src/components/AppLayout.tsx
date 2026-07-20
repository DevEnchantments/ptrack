import { useEffect, useRef, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { CommandPalette } from '@/components/CommandPalette'
import {
  ArrowUp,
  BarChart3,
  Bot,
  Clock,
  Flag,
  Folder,
  Home,
  LayoutDashboard,
  ListChecks,
  LogOut,
  Menu,
  Moon,
  Settings,
  Sun,
  Users,
} from 'lucide-react'

const PHASE2_TOOLTIP = 'Coming in Phase 2'

// Demo-order navigation. Only Projects is live in Phase 1; the rest are
// rendered in the demo's positions as disabled stubs (same convention as the
// Status Report email button).
const NAV_ITEMS: Array<{
  label: string
  icon: typeof Home
  to?: string
}> = [
  { label: 'Projects', icon: Home, to: '/' },
  { label: 'My Dashboard', icon: LayoutDashboard, to: '/dashboard' },
  { label: 'Categories', icon: Folder },
  { label: 'Milestones', icon: Flag },
  { label: 'Action Items', icon: ListChecks },
  { label: 'People', icon: Users },
  { label: 'Timeline', icon: Clock },
  { label: 'Reporting', icon: BarChart3 },
  { label: 'AI Assistant', icon: Bot },
  { label: 'Administration', icon: Settings },
]

export function AppLayout() {
  const { user, signOut } = useAuth()
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const scrollRef = useRef<HTMLDivElement | null>(null)

  // Global Ctrl/Cmd+K opens the command palette.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setPaletteOpen((o) => !o)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Theme: main.tsx applies the saved class before first paint; this state
  // mirrors it and the effect keeps <html> + localStorage in sync on toggle.
  const [dark, setDark] = useState(
    () => localStorage.getItem('ptrack:theme') === 'dark',
  )
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    try {
      localStorage.setItem('ptrack:theme', dark ? 'dark' : 'light')
    } catch {
      // Storage unavailable — the toggle still works for this session.
    }
  }, [dark])

  // Projects owns "/" and every project route; other live items match by prefix.
  const isActive = (to: string) =>
    to === '/'
      ? location.pathname === '/' || location.pathname.startsWith('/projects')
      : location.pathname.startsWith(to)

  return (
    // h-svh + overflow-hidden: the shell fills the viewport; the sidebar and
    // the content pane each scroll independently.
    <div className="flex h-svh overflow-hidden">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-sm focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <aside
        className={`flex shrink-0 flex-col overflow-y-auto bg-sidebar text-sidebar-foreground transition-all ${
          collapsed ? 'w-14' : 'w-56'
        }`}
      >
        <div className="flex h-14 items-center gap-2 px-3">
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            className="rounded-md p-2 hover:bg-sidebar-accent"
            title={collapsed ? 'Expand menu' : 'Collapse menu'}
            aria-label={collapsed ? 'Expand menu' : 'Collapse menu'}
          >
            <Menu className="h-5 w-5" />
          </button>
          {!collapsed && (
            <span className="truncate text-sm font-semibold text-white">
              P-Track
            </span>
          )}
        </div>

        <nav className="flex flex-1 flex-col gap-0.5 px-2 py-2">
          {NAV_ITEMS.map((item) =>
            item.to ? (
              <NavLink
                key={item.label}
                to={item.to}
                viewTransition
                title={collapsed ? item.label : undefined}
                className={`flex items-center gap-3 rounded-md px-2.5 py-2 text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${
                  isActive(item.to)
                    ? 'bg-sidebar-primary font-medium text-sidebar-primary-foreground'
                    : ''
                }`}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </NavLink>
            ) : (
              <span
                key={item.label}
                title={
                  collapsed ? `${item.label} — ${PHASE2_TOOLTIP}` : PHASE2_TOOLTIP
                }
                className="flex cursor-not-allowed items-center gap-3 rounded-md px-2.5 py-2 text-sm text-sidebar-foreground/40"
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </span>
            ),
          )}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center justify-end gap-4 border-b bg-background px-6">
          <button
            type="button"
            onClick={() => setPaletteOpen(true)}
            className="flex items-center gap-2 rounded-md border bg-muted/50 px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:border-ring/50 hover:text-foreground"
          >
            Search…
            <kbd className="rounded border bg-background px-1 text-[10px]">
              Ctrl K
            </kbd>
          </button>
          <button
            type="button"
            onClick={() => setDark((d) => !d)}
            title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <span className="hidden text-sm text-muted-foreground sm:inline">
            {user?.email}
          </span>
          <Button variant="outline" size="sm" onClick={() => signOut()}>
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </header>
        {/* The app's scroll container — in-page sticky bars stick to its top.
            min-h-0 is load-bearing: without it this flex child grows to its
            content height and the inner pane never overflows (= no scrolling). */}
        <div className="relative min-h-0 min-w-0 flex-1">
          <div
            id="main-content"
            ref={scrollRef}
            onScroll={(e) => setShowScrollTop(e.currentTarget.scrollTop > 600)}
            className="h-full overflow-y-auto scroll-smooth"
          >
            <Outlet />
          </div>
          {showScrollTop && (
            <button
              type="button"
              aria-label="Back to top"
              onClick={() =>
                scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
              }
              className="toast-in absolute bottom-5 right-5 z-40 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:-translate-y-0.5"
            >
              <ArrowUp className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
    </div>
  )
}
