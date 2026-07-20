import { FieldError } from '@/components/FieldError'
import { toast } from '@/lib/toast'
import { useState } from 'react'
import { linksApi, type Link } from '@/lib/api'
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

const GOLD_HELP =
  'Marking a link as a "Gold" link ensures that it appears at the top of the ' +
  'links section on the project details page and is always included in project ' +
  'details emails. If a link is not marked as "Gold" it might be omitted from ' +
  'project details emails (depending on the number of links in the project and ' +
  'the date that it was created).'

const URL_PATTERN = /^https?:\/\//

interface Props {
  projectId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdded: () => void
  existing?: Link | null
}

export function AddLinkDialog({
  projectId,
  open,
  onOpenChange,
  onAdded,
  existing,
}: Props) {
  const isEdit = Boolean(existing)

  const [url, setUrl] = useState('')
  const [label, setLabel] = useState('')
  const [description, setDescription] = useState('')
  const [isGold, setIsGold] = useState(false)
  const [tags, setTags] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  function reset() {
    setUrl('')
    setLabel('')
    setDescription('')
    setIsGold(false)
    setTags('')
    setError(null)
    setFieldErrors({})
  }

  // Populate when the dialog opens or the edited record changes — during
  // render (prev-key pattern, as in ConfirmDeleteButton), not in an effect;
  // the set-state-in-effect lint rule bans the old shape.
  const populateKey = open ? (existing?.id ?? '__new__') : null
  const [prevPopulateKey, setPrevPopulateKey] = useState<string | null>(null)
  if (prevPopulateKey !== populateKey) {
    setPrevPopulateKey(populateKey)
    if (populateKey !== null) {
      if (existing) {
        setUrl(existing.url)
        setLabel(existing.label ?? '')
        setDescription(existing.description ?? '')
        setIsGold(existing.is_gold)
        setTags(existing.tags?.join(', ') ?? '')
        setError(null)
        setFieldErrors({})
      } else {
        reset()
      }
    }
  }

  const urlError =
    url.trim() && !URL_PATTERN.test(url.trim())
      ? 'URL must start with http:// or https://'
      : null

  async function submit() {
    setError(null)
    setFieldErrors({})
    const errs: Record<string, string> = {}
    const trimmedUrl = url.trim()
    if (!trimmedUrl) errs.url = 'A URL is required.'
    if (!URL_PATTERN.test(trimmedUrl))
      errs.url = 'URL must start with http:// or https://'

    setFieldErrors(errs)
    if (Object.keys(errs).length > 0) return

    setSaving(true)
    try {
      const tagList = tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)

      const payload = {
        url: trimmedUrl,
        label: label.trim() || undefined,
        description: description.trim() || undefined,
        is_gold: isGold,
        tags: tagList.length ? tagList : undefined,
      }

      if (isEdit && existing) {
        await linksApi.update(projectId, existing.id, payload)
      } else {
        await linksApi.add(projectId, payload)
      }
      reset()
      onOpenChange(false)
      toast.success(isEdit ? 'Link updated.' : 'Link added.')
      onAdded()
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setSaving(false)
    }
  }

  async function remove() {
    if (!existing) return
    setError(null)
    setFieldErrors({})
    setDeleting(true)
    try {
      await linksApi.remove(projectId, existing.id)
      reset()
      onOpenChange(false)
      toast.success('Link deleted.')
      onAdded()
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setDeleting(false)
    }
  }

  const busy = saving || deleting

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
          <DialogTitle>Link</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label>
              URL <span className="text-destructive">*</span>
            </Label>
            <Input
              value={url}
              placeholder="https://example.com"
              onChange={(e) => setUrl(e.target.value)}
              aria-invalid={fieldErrors.url ? true : undefined}
            />
            <FieldError message={fieldErrors.url} />
            {urlError && <p className="text-sm text-destructive">{urlError}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <Label>Title</Label>
            <Input value={label} onChange={(e) => setLabel(e.target.value)} />
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
            <div className="flex items-center gap-1.5">
              <Label>Gold</Label>
              <span
                title={GOLD_HELP}
                className="inline-flex h-4 w-4 cursor-help items-center justify-center rounded-full border text-[10px] text-muted-foreground"
              >
                ?
              </span>
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
          <Button onClick={submit} disabled={busy || Boolean(urlError)}>
            {saving
              ? isEdit
                ? 'Saving…'
                : 'Adding…'
              : isEdit
                ? 'Apply Changes'
                : 'Add Link'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}