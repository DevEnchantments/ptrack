import { toast } from '@/lib/toast'
import { useEffect, useState } from 'react'
import { lookupsApi, resourcesApi, type Lookup, type Resource } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { ConfirmDeleteButton } from '@/components/ConfirmDeleteButton'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface Props {
  projectId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdded: () => void
  existing?: Resource | null
}

export function AddResourceDialog({
  projectId,
  open,
  onOpenChange,
  onAdded,
  existing,
}: Props) {
  const isEdit = Boolean(existing)

  const [types, setTypes] = useState<Lookup[]>([])
  const [name, setName] = useState('')
  const [typeId, setTypeId] = useState<string | null>(null)
  const [notes, setNotes] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const busy = saving || deleting

  async function remove() {
    if (!existing) return
    setError(null)
    setDeleting(true)
    try {
      await resourcesApi.remove(projectId, existing.id)
      reset()
      onOpenChange(false)
      onAdded()
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setDeleting(false)
    }
  }

  useEffect(() => {
    if (!open) return
    lookupsApi.list('resource-types').then(setTypes).catch(() => toast.error('Could not load resource types.'))
  }, [open])

  useEffect(() => {
    if (!open) return
    if (existing) {
      setName(existing.name)
      setTypeId(existing.type_id)
      setNotes(existing.description ?? '')
    } else {
      reset()
    }
    setError(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, existing])

  function reset() {
    setName('')
    setTypeId(null)
    setNotes('')
    setError(null)
  }

  async function submit() {
    setError(null)
    if (!name.trim()) return setError('A resource name is required.')
    if (!typeId) return setError('A type is required.')

    setSaving(true)
    try {
      const payload = {
        name: name.trim(),
        type_id: typeId,
        description: notes.trim() || undefined,
      }
      if (isEdit && existing) {
        await resourcesApi.update(projectId, existing.id, payload)
      } else {
        await resourcesApi.add(projectId, payload)
      }
      reset()
      onOpenChange(false)
      onAdded()
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setSaving(false)
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
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Project Resource</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label>
              Resource Name <span className="text-destructive">*</span>
            </Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="flex flex-col gap-2">
            <Label>
              Type <span className="text-destructive">*</span>
            </Label>
            <Select
              items={types.map((t) => ({ label: t.name, value: t.id }))}
              value={typeId ?? ''}
              onValueChange={(v) => setTypeId(v ?? null)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="- Select Type -" />
              </SelectTrigger>
              <SelectContent>
                {types.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Notes</Label>
            <Textarea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <DialogFooter>
          <div className="flex gap-2 sm:mr-auto">
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
            {isEdit && (
              <ConfirmDeleteButton
                onConfirm={remove}
                deleting={deleting}
                disabled={saving}
                resetKey={open}
              />
            )}
          </div>
          <Button onClick={submit} disabled={busy}>
            {saving
              ? isEdit
                ? 'Saving…'
                : 'Adding…'
              : isEdit
                ? 'Apply Changes'
                : 'Add Resource'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}