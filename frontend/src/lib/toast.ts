/**
 * App-wide error toasts. Call `toast.error('…')` from anywhere; the <Toaster />
 * component (components/ui/toaster.tsx) subscribes and renders. Split from the
 * component file so fast-refresh keeps working (component files must only
 * export components).
 */
type Listener = (message: string) => void

let listener: Listener | null = null

/** Used by <Toaster /> only. Returns an unsubscribe. */
export function subscribeToasts(l: Listener): () => void {
  listener = l
  return () => {
    listener = null
  }
}

export const toast = {
  error(message: string): void {
    listener?.(message)
  },
}
