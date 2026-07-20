import { FieldError } from '@/components/FieldError'
import { Loader2 } from 'lucide-react'
import { toast } from '@/lib/toast'
import { useEffect, useState } from 'react'
import { lookupsApi, updatesApi, type Lookup, type Update } from '@/lib/api'
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

const GOLD_HELP =
  'Marking an update as a "Gold" update ensures that it appears at the top of ' +
  'the updates section and is always included in project details emails. If an ' +
  'update is not marked as "Gold" it might be omitted from project details ' +
  'emails (depending on the number of updates in the project and the date that ' +
  'it was created).'

interface Props {
  projectId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdded: () => void
  existing?: Update | null
}

export function AddUpdateDialog({
  projectId,
  open,
  onOpenChange,
  onAdded,
  existing,
}: Props) {
  const isEdit = Boolean(existing)

  const [types, setTypes] = useState<Lookup[]>([])
  const [body, setBody] = useState('')
  const [typeId, setTypeId] = useState<string | null>(null)
  const [isGold, setIsGold] = useState(false)
  const [tags, setTags] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const busy = saving || deleting

  async function remove() {
    if (!existing) return
    setError(null)
    setFieldErrors({})
    setDeleting(true)
    try {
      await updatesApi.remove(projectId, existing.id)
      reset()
      onOpenChange(false)
      toast.success('Update deleted.')
      onAdded()
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setDeleting(false)
    }
  }

  useEffect(() => {
    if (!open) return
    lookupsApi
      .list('update-types')
      .then((list) => {
        setTypes(list)
        // Default new updates to "General" (or the first type).
        setTypeId((cur) => {
          if (cur || existing) return cur
          const general = list.find((t) => t.name.toLowerCase() === 'general')
          return general?.id ?? list[0]?.id ?? null
        })
      })
      .catch(() => toast.error('Could not load update types.'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  function reset() {
    setBody('')
    setTypeId(null)
    setIsGold(false)
    setTags('')
    setError(null)
    setFieldErrors({})
  }

  // Populate on open / record change — render-phase prev-key pattern.
  const populateKey = open ? (existing?.id ?? '__new__') : null
  const [prevPopulateKey, setPrevPopulateKey] = useState<string | null>(null)
  if (prevPopulateKey !== populateKey) {
    setPrevPopulateKey(populateKey)
    if (populateKey !== null) {
      if (existing) {
        setBody(existing.body ?? '')
        setTypeId(existing.type_id)
        setIsGold(existing.is_gold)
        setTags(existing.tags?.join(', ') ?? '')
      } else {
        reset()
      }
      setError(null)
      setFieldErrors({})
    }
  }

  async function submit() {
    setError(null)
    setFieldErrors({})
    const errs: Record<string, string> = {}
    if (!body.trim()) errs.body = 'An update is required.'

    setFieldErrors(errs)
    if (Object.keys(errs).length > 0) return

    setSaving(true)
    try {
      const tagList = tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)

      const payload = {
        body: body.trim(),
        type_id: typeId,
        is_gold: isGold,
        tags: tagList.length ? tagList : null,
      }

      if (isEdit && existing) {
        await updatesApi.update(projectId, existing.id, payload)
      } else {
        await updatesApi.add(projectId, payload)
      }
      reset()
      onOpenChange(false)
      toast.success(isEdit ? 'Update updated.' : 'Update added.')
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
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Project Update</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <Textarea
            rows={8}
            value={body}
            placeholder="Enter Project Update Here …"
            onChange={(e) => setBody(e.target.value)}
            aria-invalid={fieldErrors.body ? true : undefined}
          />
          <FieldError message={fieldErrors.body} />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label>Type</Label>
              <Select
                items={types.map((t) => ({ label: t.name, value: t.id }))}
                value={typeId ?? ''}
                onValueChange={(v) => setTypeId(v ?? null)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="- Select -" />
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
              <div className="flex items-center gap-1.5">
                <Label>Gold Status</Label>
                <span
                  title={GOLD_HELP}
                  className="inline-flex h-4 w-4 cursor-help items-center justify-center rounded-full border text-[10px] text-muted-foreground"
                >
                  ?
                </span>
              </div>
              <label className="flex cursor-pointer items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-input accent-primary"
                  checked={isGold}
                  onChange={(e) => setIsGold(e.target.checked)}
                />
                <span className="text-sm font-semibold">Mark as Gold</span>
              </label>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Tags</Label>
            <Input
              value={tags}
              placeholder="Enter tags separated by commas"
              onChange={(e) => setTags(e.target.value)}
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
            {saving && <Loader2 className="animate-spin" />}
            {saving
              ? isEdit
                ? 'Saving…'
                : 'Adding…'
              : isEdit
                ? 'Apply Changes'
                : 'Add Update'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}