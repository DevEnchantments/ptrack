const TONE_CLASSES: Record<string, string> = {
  positive: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  caution: 'border-amber-200 bg-amber-50 text-amber-700',
  critical: 'border-red-200 bg-red-50 text-red-700',
  info: 'border-blue-200 bg-blue-50 text-blue-700',
  neutral: 'border-transparent bg-muted text-muted-foreground',
}

function toneFor(status: string): string {
  const s = status.trim().toLowerCase().replace(/_/g, ' ')
  if (s === 'hot' || s === 'overdue') return 'critical'
  if (s === 'elevated') return 'caution'
  if (
    s === 'on track' ||
    s === 'complete' ||
    s === 'completed' ||
    s === 'closed' ||
    s === 'closed completed' ||
    s.startsWith('closed')
  )
    return 'positive'
  if (s === 'open') return 'info'
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
