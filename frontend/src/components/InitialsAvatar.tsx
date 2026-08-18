// Identity hues live in index.css (--avatar-N-*), light + dark pairs; same
// values as the old raw *-100/*-700 classes, now theme-editable like the rest
// of palette C.
// Literal strings: Tailwind's scanner cannot see composed class names.
const PALETTE = [
  'bg-[var(--avatar-1-bg)] text-[var(--avatar-1-fg)]',
  'bg-[var(--avatar-2-bg)] text-[var(--avatar-2-fg)]',
  'bg-[var(--avatar-3-bg)] text-[var(--avatar-3-fg)]',
  'bg-[var(--avatar-4-bg)] text-[var(--avatar-4-fg)]',
  'bg-[var(--avatar-5-bg)] text-[var(--avatar-5-fg)]',
  'bg-[var(--avatar-6-bg)] text-[var(--avatar-6-fg)]',
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
  size?: 'sm' | 'md' | 'lg'
  className?: string
}) {
  const sizeCls =
    size === 'sm'
      ? 'h-6 w-6 text-[10px]'
      : size === 'lg'
        ? 'h-16 w-16 text-xl'
        : 'h-8 w-8 text-xs'
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
