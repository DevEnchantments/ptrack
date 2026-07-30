import { Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProjectActionsButton } from '@/components/ProjectActions'

interface NavSection {
  id: string
  label: string
  count: number
}

interface Props {
  sections: NavSection[]
  activeId: string | null
  /** Project name — shown once the page's own H1 has scrolled out of view. */
  projectName: string
  restricted: boolean
  showName: boolean
  onEdit: () => void
  /** Dispatches a create action; drives the below-`lg` "Add" dialog. */
  onAction: (action: string) => void
}

/**
 * Sticky in-page navigator: section chips with counts that smooth-scroll to
 * their section (scroll-spy highlights the one in view), plus the project
 * name + Edit fading in once the header H1 leaves the viewport. Below `lg` it
 * also carries the create actions, which have no rail to live in at that width.
 */
export function SectionNav({
  sections,
  activeId,
  projectName,
  restricted,
  showName,
  onEdit,
  onAction,
}: Props) {
  return (
    <div className="sticky top-0 z-30 border-b bg-background/85 px-6 py-2 backdrop-blur">
      <div
        className="flex items-center gap-2 overflow-hidden transition-[max-height,opacity] duration-300"
        style={{
          maxHeight: showName ? 40 : 0,
          opacity: showName ? 1 : 0,
        }}
      >
        <span className="flex min-w-0 items-center gap-1.5 pb-1 text-sm font-semibold">
          {restricted && (
            <Lock className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          )}
          <span className="truncate">{projectName}</span>
        </span>
        <Button
          variant="outline"
          size="xs"
          className="mb-1 ml-auto shrink-0"
          onClick={onEdit}
        >
          Edit
        </Button>
      </div>
      <div className="flex items-center gap-2">
        {/* The right-edge fade only applies below `lg`; at wider widths all
            nine chips fit and a permanent fade would just dim the last one. */}
        <nav
          aria-label="Project sections"
          className="flex flex-1 gap-1 overflow-x-auto [mask-image:linear-gradient(to_right,black_calc(100%-1.5rem),transparent)] lg:[mask-image:none]"
        >
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              aria-current={activeId === s.id ? 'true' : undefined}
              className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-ring ${
                activeId === s.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              }`}
            >
              {s.label}
              <span
                className={`tabular-nums ${
                  activeId === s.id
                    ? 'text-primary-foreground/80'
                    : 'text-muted-foreground/70'
                }`}
              >
                {s.count}
              </span>
            </a>
          ))}
        </nav>
        <ProjectActionsButton onAction={onAction} />
      </div>
    </div>
  )
}
