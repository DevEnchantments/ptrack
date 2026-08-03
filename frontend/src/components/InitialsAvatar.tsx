import { initials } from '@/lib/format'

/** Count of --avatar-N-bg / --avatar-N-fg token pairs defined in index.css. */
const AVATAR_HUES = 6

/** Deterministic hue per name, so the same person is always the same color. */
function hueOf(name: string): number {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) | 0
  return (Math.abs(hash) % AVATAR_HUES) + 1
}

function hueStyle(name: string) {
  const n = hueOf(name)
  return {
    backgroundColor: `var(--avatar-${n}-bg)`,
    color: `var(--avatar-${n}-fg)`,
  }
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
      style={hueStyle(name)}
      className={`flex shrink-0 items-center justify-center rounded-full font-semibold ${sizeCls} ${className}`}
    >
      {initials(name)}
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
