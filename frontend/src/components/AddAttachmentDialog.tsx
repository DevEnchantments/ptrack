import { FieldError } from '@/components/FieldError'
import { toast } from '@/lib/toast'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { attachmentsApi, type Attachment } from '@/lib/api'
import { GOLD_HELP } from '@/lib/help-text'
import { HelpDot } from '@/components/HelpDot'
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

const MAX_BYTES = 100 * 1024 * 1024

interface Props {
  projectId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdded: () => void
  existing?: Attachment | null
}

export function AddAttachmentDialog({
  projectId,
  open,
  onOpenChange,
  onAdded,
  existing,
}: Props) {
  const isEdit = Boolean(existing)

  const [file, setFile] = useState<File | null>(null)
  const [isGold, setIsGold] = useState(false)
  const [description, setDescription] = useState('')
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
      await attachmentsApi.remove(projectId, existing.id)
      reset()
      onOpenChange(false)
      toast.success('Attachment deleted.')
      onAdded()
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setDeleting(false)
    }
  }

  function reset() {
    setFile(null)
    setIsGold(false)
    setDescription('')
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
        setFile(null)
        setIsGold(existing.is_gold)
        setDescription(existing.description ?? '')
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
    const tagList = tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)

    setSaving(true)
    try {
      if (isEdit && existing) {
        await attachmentsApi.update(projectId, existing.id, {
          is_gold: isGold,
          description: description.trim() || null,
          tags: tagList.length ? tagList : null,
        })
      } else {
        if (!file) {
          setSaving(false)
          setFieldErrors({ file: 'A file is required.' })
          return
        }
        if (file.size > MAX_BYTES) {
          setSaving(false)
          setFieldErrors({ file: 'Attachments must be under 100M in size.' })
          return
        }
        const fd = new FormData()
        fd.append('file', file)
        fd.append('is_gold', String(isGold))
        if (description.trim()) fd.append('description', description.trim())
        if (tagList.length) fd.append('tags', tagList.join(','))
        await attachmentsApi.upload(projectId, fd)
      }
      reset()
      onOpenChange(false)
      toast.success(isEdit ? 'Attachment updated.' : 'Attachment added.')
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
          <DialogTitle>Attachment</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {isEdit ? (
            <div className="flex flex-col gap-2">
              <Label>File</Label>
              <p className="text-sm font-medium">{existing?.file_name}</p>
              <p className="text-xs text-muted-foreground">
                The file itself can't be changed — edit its details below.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-4">
                <Label>
                  File <span className="text-destructive">*</span>
                </Label>
                <span className="text-xs text-muted-foreground">
                  Attachments must be under 100M in size.
                </span>
              </div>
              <input
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-md file:border file:border-input file:bg-background file:px-3 file:py-2 file:text-sm file:font-medium hover:file:bg-accent"
              />
              <FieldError message={fieldErrors.file} />
            </div>
          )}

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1.5">
              <Label>Gold</Label>
              <HelpDot text={GOLD_HELP} />
            </div>
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-input accent-primary"
                checked={isGold}
                onChange={(e) => setIsGold(e.target.checked)}
              />
              <span className="text-sm font-semibold">Mark as Gold</span>
            </label>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Description</Label>
            <Textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Tags</Label>
            <Input
              value={tags}
              placeholder="Enter tags separated by commas"
              onChange={(e) => setTags(e.target.value)}
            />
          </div>

          {error && <p className="hint-in text-sm font-medium text-destructive">{error}</p>}
        </div>

        <DialogFooter className="sm:justify-between">
          <div>
            {isEdit && (
              <ConfirmDeleteButton
                onConfirm={remove}
                deleting={deleting}
                disabled={saving}
                resetKey={open}
              />
            )}
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
              {saving
                ? isEdit
                  ? 'Saving…'
                  : 'Uploading…'
                : isEdit
                  ? 'Apply Changes'
                  : 'Upload Attachment'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}