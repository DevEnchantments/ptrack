import { FieldError } from '@/components/FieldError'
import { Loader2 } from 'lucide-react'
import { toast } from '@/lib/toast'
import { useState } from 'react'
import { outcomesApi, type ProgramOutcome } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { ConfirmDeleteButton } from '@/components/ConfirmDeleteButton'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface Props {
  projectId: string
  outcome: ProgramOutcome | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSaved: () => void
}

/** Edit-only dialog for FDD Fig 2 program outcomes (creation stays in the
 *  milestone dialog). Deleting an outcome ungroups its milestones — the DB
 *  FK is `on delete set null`, nothing else is touched. */
export function EditOutcomeDialog({
  projectId,
  outcome,
  open,
  onOpenChange,
  onSaved,
}: Props) {
  const [name, setName] = useState('')
  const [sortOrder, setSortOrder] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const busy = saving || deleting

  function reset() {
    setName('')
    setSortOrder('')
    setStartDate('')
    setEndDate('')
    setError(null)
    setFieldErrors({})
  }

  // Populate on open / record change — render-phase prev-key pattern.
  const populateKey = open && outcome ? outcome.id : null
  const [prevPopulateKey, setPrevPopulateKey] = useState<string | null>(null)
  if (prevPopulateKey !== populateKey) {
    setPrevPopulateKey(populateKey)
    if (populateKey !== null && outcome) {
      setName(outcome.name)
      setSortOrder(outcome.sort_order === null ? '' : String(outcome.sort_order))
      setStartDate(outcome.start_date ?? '')
      setEndDate(outcome.end_date ?? '')
      setError(null)
      setFieldErrors({})
    }
  }

  async function submit() {
    if (!outcome) return
    setError(null)
    setFieldErrors({})
    const errs: Record<string, string> = {}
    if (!name.trim()) errs.name = 'An outcome name is required.'
    const order = sortOrder.trim()
    if (order && (!Number.isInteger(Number(order)) || Number(order) < 1))
      errs.sort_order = 'The number must be a whole number of 1 or more.'
    if (startDate && endDate && endDate < startDate)
      errs.end_date = 'The end date cannot be before the start date.'

    setFieldErrors(errs)
    if (Object.keys(errs).length > 0) return

    setSaving(true)
    try {
      await outcomesApi.update(projectId, outcome.id, {
        name: name.trim(),
        sort_order: order ? Number(order) : null,
        start_date: startDate || null,
        end_date: endDate || null,
      })
      reset()
      onOpenChange(false)
      toast.success('Outcome updated.')
      onSaved()
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setSaving(false)
    }
  }

  async function remove() {
    if (!outcome) return
    setError(null)
    setFieldErrors({})
    setDeleting(true)
    try {
      await outcomesApi.remove(projectId, outcome.id)
      reset()
      onOpenChange(false)
      toast.success('Outcome deleted. Its milestones are now ungrouped.')
      onSaved()
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) reset()
        onOpenChange(o)
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Outcome</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label>
              Name <span className="text-destructive">*</span>
            </Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              aria-invalid={fieldErrors.name ? true : undefined}
            />
            <FieldError message={fieldErrors.name} />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Number</Label>
            <Input
              type="number"
              min={1}
              className="w-24"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              aria-invalid={fieldErrors.sort_order ? true : undefined}
            />
            <FieldError message={fieldErrors.sort_order} />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label>Start Date</Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>End Date</Label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                aria-invalid={fieldErrors.end_date ? true : undefined}
              />
              <FieldError message={fieldErrors.end_date} />
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            Deleting an outcome keeps its milestones — they move to the "No
            outcome" group.
          </p>

          {error && (
            <p className="hint-in text-sm font-medium text-destructive">
              {error}
            </p>
          )}
        </div>

        <DialogFooter className="sm:justify-between">
          <div>
            <ConfirmDeleteButton
              onConfirm={remove}
              deleting={deleting}
              disabled={saving}
              resetKey={open}
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                reset()
                onOpenChange(false)
              }}
              disabled={busy}
            >
              Cancel
            </Button>
            <Button onClick={submit} disabled={busy}>
              {saving && <Loader2 className="animate-spin" />}
              {saving ? 'Saving…' : 'Apply Changes'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
