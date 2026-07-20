import { useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import {
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
  Settings,
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

  // Projects owns "/" and every project route; other live items match by prefix.
  const isActive = (to: string) =>
    to === '/'
      ? location.pathname === '/' || location.pathname.startsWith('/projects')
      : location.pathname.startsWith(to)

  return (
    <div className="flex min-h-svh">
      <aside
        className={`flex shrink-0 flex-col bg-sidebar text-sidebar-foreground transition-all ${
          collapsed ? 'w-14' : 'w-56'
        }`}
      >
        <div className="flex h-14 items-center gap-2 px-3">
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            className="rounded-md p-2 hover:bg-sidebar-accent"
            title={collapsed ? 'Expand menu' : 'Collapse menu'}
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
        <header className="flex h-14 items-center justify-end gap-4 border-b bg-background px-6">
          <span className="hidden text-sm text-muted-foreground sm:inline">
            {user?.email}
          </span>
          <Button variant="outline" size="sm" onClick={() => signOut()}>
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </header>
        <div className="min-w-0 flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
