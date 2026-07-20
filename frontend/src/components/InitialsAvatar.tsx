const PALETTE = [
  'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200',
  'bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-200',
  'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200',
  'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-200',
  'bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-200',
  'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200',
]

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[1][0]).toUpperCase()
}

/** Deterministic pastel per name, so the same person is always the same color. */
function colorOf(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) | 0
  return PALETTE[Math.abs(hash) % PALETTE.length]
}

export function InitialsAvatar({
  name,
  size = 'md',
  className = '',
}: {
  name: string
  size?: 'sm' | 'md'
  className?: string
}) {
  const sizeCls = size === 'sm' ? 'h-6 w-6 text-[10px]' : 'h-8 w-8 text-xs'
  return (
    <span
      title={name}
      className={`flex shrink-0 items-center justify-center rounded-full font-semibold ${sizeCls} ${colorOf(name)} ${className}`}
    >
      {initialsOf(name)}
    </span>
  )
}

/** Overlapping row of avatars (max 4 shown, "+n" tail beyond that). */
export function AvatarCluster({ names }: { names: string[] }) {
  const shown = names.slice(0, 4)
  const extra = names.length - shown.length
  return (
    <span className="inline-flex items-center" title={names.join(', ')}>
      {shown.map((n, i) => (
        <InitialsAvatar
          key={`${n}-${i}`}
          name={n}
          size="sm"
          className={`ring-2 ring-card ${i > 0 ? '-ml-1.5' : ''}`}
        />
      ))}
      {extra > 0 && (
        <span className="-ml-1.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-semibold text-muted-foreground ring-2 ring-card">
          +{extra}
        </span>
      )}
    </span>
  )
}
