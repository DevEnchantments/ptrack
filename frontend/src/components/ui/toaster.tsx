import { useEffect, useState } from 'react'
import { subscribeToasts } from '@/lib/toast'

/**
 * Renders error toasts fired via `toast.error()` (lib/toast.ts). Mounted once
 * in App. Exists because the app's data loaders used to swallow failures
 * silently — an empty section looked identical to "no data", which is a lie
 * when the request failed.
 */
interface ToastItem {
  id: number
  message: string
}

const TOAST_MS = 6000
let seq = 0

export function Toaster() {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  useEffect(() => {
    return subscribeToasts((message) => {
      const id = ++seq
      setToasts((prev) => [...prev, { id, message }])
      setTimeout(
        () => setToasts((prev) => prev.filter((t) => t.id !== id)),
        TOAST_MS,
      )
    })
  }, [])

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 flex w-80 flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          role="alert"
          className="rounded-md border border-destructive/40 bg-background px-4 py-3 text-sm text-destructive shadow-lg"
        >
          {t.message}
        </div>
      ))}
    </div>
  )
}
