/** Inline validation message rendered under the offending field. */
export function FieldError({ message }: { message?: string | null }) {
  if (!message) return null
  return (
    <p className="hint-in text-xs font-medium text-destructive">{message}</p>
  )
}
