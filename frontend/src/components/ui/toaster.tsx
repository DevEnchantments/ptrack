import { useEffect, useState } from 'react'
import { CheckCircle2, CircleAlert } from 'lucide-react'
import { subscribeToasts, type ToastKind } from '@/lib/toast'

/**
 * Renders toasts fired via `toast.error()` / `toast.success()` (lib/toast.ts).
 * Mounted once in App. Errors exist because the app's data loaders used to
 * swallow failures silently; successes close the loop on saves.
 */
interface ToastItem {
  id: number
  message: string
  kind: ToastKind
  closing?: boolean
}

const TOAST_MS = { error: 6000, success: 3000 }
// Exit runs the entrance path in reverse; must match .toast-out in index.css.
const EXIT_MS = 150
let seq = 0

const KIND_CLASSES: Record<ToastKind, string> = {
  error: 'border-destructive/30 border-l-destructive text-destructive',
  success: 'border-success-border/40 border-l-success-border text-success',
}

export function Toaster() {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  useEffect(() => {
    return subscribeToasts((message, kind) => {
      const id = ++seq
      setToasts((prev) => [...prev, { id, message, kind }])
      setTimeout(() => {
        setToasts((prev) =>
          prev.map((t) => (t.id === id ? { ...t, closing: true } : t)),
        )
        setTimeout(
          () => setToasts((prev) => prev.filter((t) => t.id !== id)),
          EXIT_MS,
        )
      }, TOAST_MS[kind])
    })
  }, [])

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 flex w-80 flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          role={t.kind === 'error' ? 'alert' : 'status'}
          className={`${t.closing ? 'toast-out' : 'toast-in'} flex items-start gap-2 rounded-md border border-l-4 bg-popover px-4 py-3 text-sm shadow-lg ${KIND_CLASSES[t.kind]}`}
        >
          {t.kind === 'success' ? (
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          ) : (
            <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" />
          )}
          {t.message}
        </div>
      ))}
    </div>
  )
}
