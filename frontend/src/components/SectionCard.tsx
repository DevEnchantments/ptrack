import type { ReactNode } from 'react'
import { ChevronDown, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

interface Props {
  id: string
  title: string
  count: number
  collapsed: boolean
  onToggle: () => void
  /** Position in the page, drives the one-time entrance stagger. */
  index: number
  entered: boolean
  loading: boolean
  emptyLabel: string
  emptyActionLabel?: string
  onEmptyAction?: () => void
  children: ReactNode
}

/**
 * Collapsible project-page section: header with count + chevron, animated
 * height (grid-rows trick — no measuring), skeleton while loading, and an
 * actionable empty state. Entrance is a one-time staggered fade-up.
 */
export function SectionCard({
  id,
  title,
  count,
  collapsed,
  onToggle,
  index,
  entered,
  loading,
  emptyLabel,
  emptyActionLabel,
  onEmptyAction,
  children,
}: Props) {
  return (
    <section
      id={id}
      className="mt-8 scroll-mt-28 transition-[opacity,transform] duration-500 ease-out"
      style={{
        opacity: entered ? 1 : 0,
        transform: entered ? 'none' : 'translateY(10px)',
        transitionDelay: `${index * 45}ms`,
      }}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={!collapsed}
        className="group flex w-full items-center gap-2 text-left"
      >
        <h2 className="text-lg font-semibold">{title}</h2>
        <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium tabular-nums text-muted-foreground">
          {loading ? '…' : count}
        </span>
        <ChevronDown
          className={`ml-auto h-4 w-4 text-muted-foreground transition-transform duration-300 group-hover:text-foreground ${
            collapsed ? '-rotate-90' : ''
          }`}
        />
      </button>

      <div
        className="grid transition-[grid-template-rows] duration-300 ease-out"
        style={{ gridTemplateRows: collapsed ? '0fr' : '1fr' }}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="pt-3">
            {loading ? (
              <div className="flex flex-col gap-2 rounded-md border p-4">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-3/5" />
              </div>
            ) : count === 0 ? (
              <div className="flex items-center justify-between gap-3 rounded-md border border-dashed px-4 py-5">
                <p className="text-sm text-muted-foreground">{emptyLabel}</p>
                {emptyActionLabel && onEmptyAction && (
                  <Button variant="outline" size="sm" onClick={onEmptyAction}>
                    <Plus className="h-4 w-4" />
                    {emptyActionLabel}
                  </Button>
                )}
              </div>
            ) : (
              children
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
