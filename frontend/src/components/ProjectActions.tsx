import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

const ACTIONS = [
  'Add Person',
  'Add Issue',
  'Add Resource',
  'Add Milestone',
  'Add Action Item',
  'Add Link',
  'Attach File',
  'Add Update',
  'Add Status Report',
]

interface Props {
  onAction: (action: string) => void
}

/**
 * The project's create actions. Rendered twice: as the sticky right-hand rail
 * from `lg` up, and inside `ProjectActionsButton`'s dialog below it — where the
 * rail would otherwise land beneath all nine sections, effectively out of reach.
 */
export function ProjectActions({ onAction }: Props) {
  return (
    <div className="rounded-md border p-2">
      {ACTIONS.map((a, i) => (
        <button
          key={a}
          type="button"
          onClick={() => onAction(a)}
          style={{ animationDelay: `${i * 35}ms` }}
          className="stagger-in w-full cursor-pointer rounded px-3 py-2 text-left text-sm transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-ring"
        >
          {a}
        </button>
      ))}
    </div>
  )
}

/**
 * Below `lg`, the same actions behind an "Add" button in the sticky section
 * nav. Uses the existing Dialog primitive rather than a dropdown: no
 * dropdown-menu component exists in `components/ui`, and adding one would pull
 * a Radix dependency into a Base UI codebase.
 */
export function ProjectActionsButton({ onAction }: Props) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="shrink-0 lg:hidden"
        onClick={() => setOpen(true)}
      >
        <Plus className="h-4 w-4" />
        Add
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add to this project</DialogTitle>
          </DialogHeader>
          <ProjectActions
            onAction={(a) => {
              setOpen(false)
              onAction(a)
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}
