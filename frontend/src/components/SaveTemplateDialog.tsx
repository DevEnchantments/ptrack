import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { templatesApi } from '@/lib/api'
import { toast } from '@/lib/toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface Props {
  projectId: string
  projectName: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

/** Snapshots this project's structure (fields, outcomes, milestones with
 *  weights; dates become offsets from project start) as a reusable template. */
export function SaveTemplateDialog({
  projectId,
  projectName,
  open,
  onOpenChange,
}: Props) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Prefill the template name from the project on open (prev-key pattern).
  const populateKey = open ? projectId : null
  const [prevPopulateKey, setPrevPopulateKey] = useState<string | null>(null)
  if (prevPopulateKey !== populateKey) {
    setPrevPopulateKey(populateKey)
    if (populateKey !== null) {
      setName(`${projectName} template`)
      setDescription('')
      setError(null)
    }
  }

  async function save() {
    const clean = name.trim()
    if (!clean) {
      setError('A template name is required.')
      return
    }
    setSaving(true)
    setError(null)
    try {
      const t = await templatesApi.save(clean, description.trim() || null, projectId)
      onOpenChange(false)
      toast.success(
        `Template saved (${t.outcome_count} outcomes, ${t.milestone_count} milestones).`,
      )
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Save as Template</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            Captures this project's field defaults, outcomes, and milestones
            (weights included; dates become offsets from the start date).
            People, action items, and progress are not copied.
          </p>
          <div className="flex flex-col gap-2">
            <Label>
              Template Name <span className="text-destructive">*</span>
            </Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Description</Label>
            <Textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          {error && (
            <p className="hint-in text-sm font-medium text-destructive">
              {error}
            </p>
          )}
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button onClick={save} disabled={saving}>
            {saving && <Loader2 className="animate-spin" />}
            {saving ? 'Saving…' : 'Save Template'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
