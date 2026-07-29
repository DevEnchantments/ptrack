/**
 * Small "?" dot that reveals help text via the native title tooltip.
 * Shared by the dialog forms (previously copy-pasted inline in each).
 */
export function HelpDot({ text }: { text: string }) {
  return (
    <span
      title={text}
      className="inline-flex h-4 w-4 cursor-help items-center justify-center rounded-full border text-[10px] text-muted-foreground"
    >
      ?
    </span>
  )
}
