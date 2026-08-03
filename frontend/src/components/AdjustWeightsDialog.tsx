import { Loader2 } from 'lucide-react'
import { toast } from '@/lib/toast'
import { useState } from 'react'
import { milestonesApi, type Milestone } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface Props {
  projectId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  milestones: Milestone[]
  onSaved: () => void
}

/**
 * UC-08 Adjust Weights: edit every active milestone's weight in one place.
 * Saving requires the total to be exactly 100 (FDD 3.3.2), or every field
 * empty to clear weights (equal weighting per FORMULAS.md F1).
 */
export function AdjustWeightsDialog({
  projectId,
  open,
  onOpenChange,
  milestones,
  onSaved,
}: Props) {
  const active = milestones.filter((m) => m.status !== 'not_applicable')

  const [values, setValues] = useState<Record<string, string>>({})
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  // Populate on open — render-phase prev-key pattern.
  const populateKey = open ? projectId : null
  const [prevPopulateKey, setPrevPopulateKey] = useState<string | null>(null)
  if (prevPopulateKey !== populateKey) {
    setPrevPopulateKey(populateKey)
    if (populateKey !== null) {
      const next: Record<string, string> = {}
      for (const m of active) {
        next[m.id] = m.weightage != null ? String(m.weightage) : ''
      }
      setValues(next)
      setError(null)
    }
  }

  const total = active.reduce(
    (sum, m) => sum + (Number(values[m.id]) || 0),
    0,
  )
  const allEmpty = active.every((m) => !(values[m.id] ?? '').trim())
  const valid = allEmpty || Math.abs(total - 100) < 0.001

  async function save() {
    setError(null)
    setSaving(true)
    try {
      await milestonesApi.adjustWeights(
        projectId,
        active.map((m) => ({
          id: m.id,
          weightage: (values[m.id] ?? '').trim() ? Number(values[m.id]) : null,
        })),
      )
      onOpenChange(false)
      toast.success('Weights updated.')
      onSaved()
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Adjust Weights</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            Weights must total exactly 100 to save. Leave every field empty to
            clear weights (milestones then count equally).
          </p>

          {active.length === 0 ? (
            <div className="rounded-md border border-dashed px-4 py-5 text-sm text-muted-foreground">
              No active milestones to weight.
            </div>
          ) : (
            <ul className="divide-y rounded-md border">
              {active.map((m) => (
                <li
                  key={m.id}
                  className="flex items-center justify-between gap-4 px-4 py-2.5"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{m.name}</p>
                    {m.due_date && (
                      <p className="text-xs text-muted-foreground">
                        Due {m.due_date}
                      </p>
                    )}
                  </div>
                  <Input
                    type="number"
                    min={0}
                    className="w-24 text-right"
                    value={values[m.id] ?? ''}
                    onChange={(e) =>
                      setValues((cur) => ({ ...cur, [m.id]: e.target.value }))
                    }
                  />
                </li>
              ))}
            </ul>
          )}

          {error && (
            <p className="hint-in text-sm font-medium text-destructive">
              {error}
            </p>
          )}
        </div>

        <DialogFooter className="sm:justify-between">
          <span
            className={`text-sm font-medium tabular-nums ${
              allEmpty
                ? 'text-muted-foreground'
                : valid
                  ? 'text-success'
                  : 'text-destructive'
            }`}
          >
            {allEmpty ? 'No weights set' : `Total ${total}/100`}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              onClick={save}
              disabled={saving || !valid || active.length === 0}
            >
              {saving && <Loader2 className="animate-spin" />}
              {saving ? 'Saving…' : 'Save Weights'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
