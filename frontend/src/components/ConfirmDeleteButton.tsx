import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Props {
  onConfirm: () => void | Promise<void>
  /** True while the delete request is in flight. */
  deleting?: boolean
  disabled?: boolean
  /**
   * Changing this disarms the button. Dialogs pass their `open` flag so a
   * button left armed on close is never still armed on reopen.
   */
  resetKey?: unknown
}

/**
 * Two-step delete: the first click arms, the second confirms. Deletes here are
 * irreversible and the button sits next to Cancel, so a single stray click must
 * not destroy a record.
 */
export function ConfirmDeleteButton({
  onConfirm,
  deleting,
  disabled,
  resetKey,
}: Props) {
  const [armed, setArmed] = useState(false)

  // Disarm when resetKey changes. Adjusting state during render (rather than in
  // an effect) avoids a cascading re-render — see react.dev "You Might Not Need
  // an Effect".
  const [prevResetKey, setPrevResetKey] = useState(resetKey)
  if (prevResetKey !== resetKey) {
    setPrevResetKey(resetKey)
    setArmed(false)
  }

  if (deleting) {
    return (
      <Button variant="destructive" disabled>
        <Loader2 className="animate-spin" />
        Deleting…
      </Button>
    )
  }

  if (armed) {
    return (
      <div className="flex gap-2">
        <Button
          variant="destructive"
          className="bg-destructive text-white hover:bg-destructive/90"
          onClick={() => void onConfirm()}
          disabled={disabled}
        >
          Confirm Delete
        </Button>
        <Button
          variant="ghost"
          onClick={() => setArmed(false)}
          disabled={disabled}
        >
          Keep
        </Button>
      </div>
    )
  }

  return (
    <Button
      variant="destructive"
      className="border border-destructive/40 bg-transparent"
      onClick={() => setArmed(true)}
      disabled={disabled}
    >
      Delete
    </Button>
  )
}
