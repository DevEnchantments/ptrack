const TONE_CLASSES: Record<string, string> = {
  positive:
    'border-status-green-border bg-status-green-bg text-status-green-fg',
  caution:
    'border-status-amber-border bg-status-amber-bg text-status-amber-fg',
  critical:
    'border-status-red-border bg-status-red-bg text-status-red-fg',
  info: 'border-status-blue-border bg-status-blue-bg text-status-blue-fg',
  neutral: 'border-transparent bg-muted text-muted-foreground',
}

function toneFor(status: string): string {
  const s = status.trim().toLowerCase().replace(/_/g, ' ')
  if (s === 'hot' || s === 'overdue') return 'critical'
  if (s === 'elevated' || s === 'on hold') return 'caution'
  if (
    s === 'on track' ||
    s === 'complete' ||
    s === 'completed' ||
    s === 'closed' ||
    s === 'closed completed' ||
    s.startsWith('closed')
  )
    return 'positive'
  if (s === 'open' || s === 'in progress') return 'info'
  return 'neutral' // dormant, unknown, not applicable, pending, custom values
}

/**
 * Tinted status chip. `status` drives the color; `label` overrides the
 * displayed text (e.g. a prettified STATUS_LABELS value).
 */
export function StatusPill({
  status,
  label,
}: {
  status: string
  label?: string
}) {
  return (
    <span
      className={`inline-flex shrink-0 items-center whitespace-nowrap rounded-full border px-2 py-0.5 text-xs font-medium ${TONE_CLASSES[toneFor(status)]}`}
    >
      {label ?? status}
    </span>
  )
}
