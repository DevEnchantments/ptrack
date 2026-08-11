interface Props {
  tags: string[] | null | undefined
  /** When set, chips become clickable (e.g. to filter by the tag). */
  onTagClick?: (tag: string) => void
  className?: string
}

/** Muted tag chips; renders nothing when the record has no tags. Clickable
 *  chips stop propagation so they work inside clickable rows/cards. */
export function TagChips({ tags, onTagClick, className }: Props) {
  if (!tags?.length) return null
  const chipCls =
    'rounded-full border bg-muted px-2 py-0.5 text-xs text-muted-foreground'
  return (
    <span
      className={`inline-flex flex-wrap items-center gap-1 ${className ?? ''}`}
    >
      {tags.map((tag) =>
        onTagClick ? (
          <button
            key={tag}
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onTagClick(tag)
            }}
            className={`${chipCls} cursor-pointer transition-colors hover:border-ring/50 hover:text-foreground`}
          >
            {tag}
          </button>
        ) : (
          <span key={tag} className={chipCls}>
            {tag}
          </span>
        ),
      )}
    </span>
  )
}
