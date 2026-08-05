import { Bell } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { notificationsApi, type AppNotification } from '@/lib/api'
import { toast } from '@/lib/toast'

function timeAgo(iso: string): string {
  const sec = Math.round((Date.now() - new Date(iso).getTime()) / 1000)
  if (sec < 60) return 'just now'
  const min = Math.round(sec / 60)
  if (min < 60) return `${min}m ago`
  const hr = Math.round(min / 60)
  if (hr < 24) return `${hr}h ago`
  const day = Math.round(hr / 24)
  if (day < 30) return `${day}d ago`
  return `${Math.round(day / 30)}mo ago`
}

/** FDD 3.9 in-app notification center (header bell). */
export function NotificationBell() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState<AppNotification[]>([])
  const boxRef = useRef<HTMLDivElement>(null)

  function refresh() {
    notificationsApi
      .list()
      .then(setItems)
      .catch(() => toast.error('Could not load notifications.'))
  }

  useEffect(() => {
    refresh()
  }, [])

  useEffect(() => {
    if (!open) return
    refresh()
    function onClick(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [open])

  const unread = items.filter((n) => !n.read_at).length

  function openItem(n: AppNotification) {
    if (!n.read_at) {
      setItems((cur) =>
        cur.map((x) =>
          x.id === n.id ? { ...x, read_at: new Date().toISOString() } : x,
        ),
      )
      notificationsApi.markRead(n.id).catch(() => refresh())
    }
    setOpen(false)
    if (n.project_id) navigate(`/projects/${n.project_id}`)
  }

  function markAll() {
    setItems((cur) =>
      cur.map((x) => ({ ...x, read_at: x.read_at ?? new Date().toISOString() })),
    )
    notificationsApi.markAllRead().catch(() => refresh())
  }

  return (
    <div ref={boxRef} className="relative">
      <button
        type="button"
        aria-label={
          unread > 0 ? `Notifications (${unread} unread)` : 'Notifications'
        }
        onClick={() => setOpen((o) => !o)}
        className="relative rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
      >
        <Bell className="h-4 w-4" />
        {unread > 0 && (
          <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold tabular-nums text-destructive-foreground">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-md border bg-popover shadow-md">
          <div className="flex items-center justify-between border-b px-3 py-2">
            <span className="text-sm font-medium">Notifications</span>
            {unread > 0 && (
              <button
                type="button"
                onClick={markAll}
                className="text-xs text-primary hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>
          {items.length === 0 ? (
            <p className="px-3 py-6 text-center text-sm text-muted-foreground">
              No notifications yet.
            </p>
          ) : (
            <ul className="max-h-80 divide-y overflow-y-auto">
              {items.map((n) => (
                <li key={n.id}>
                  <button
                    type="button"
                    onClick={() => openItem(n)}
                    className="flex w-full flex-col gap-0.5 px-3 py-2.5 text-left transition-colors hover:bg-accent"
                  >
                    <span className="flex items-center gap-2 text-sm font-medium">
                      {!n.read_at && (
                        <span
                          aria-hidden
                          className="h-2 w-2 shrink-0 rounded-full bg-primary"
                        />
                      )}
                      <span className="min-w-0 truncate">{n.title}</span>
                    </span>
                    {n.body && (
                      <span className="line-clamp-2 text-xs text-muted-foreground">
                        {n.body}
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {timeAgo(n.created_at)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
