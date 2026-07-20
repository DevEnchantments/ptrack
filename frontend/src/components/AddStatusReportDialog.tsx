import { FieldError } from '@/components/FieldError'
import { toast } from '@/lib/toast'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { statusReportsApi, type StatusReport } from '@/lib/api'
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

const VIEWABLE_OPTIONS = [
  { label: 'Submitter', value: 'submitter' },
  { label: 'Submitter and Project Members', value: 'submitter_and_members' },
  { label: 'All', value: 'all' },
]

const EDITABLE_OPTIONS = [
  { label: 'Submitter', value: 'submitter' },
  { label: 'Submitter and Project Members', value: 'submitter_and_members' },
  { label: 'All Contributors', value: 'all_contributors' },
]

function today(): string {
  return new Date().toISOString().slice(0, 10)
}

interface Props {
  projectId: string
  projectName: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdded: () => void
  existing?: StatusReport | null
}

function RadioRow({
  label,
  options,
  value,
  onChange,
  name,
}: {
  label: string
  options: { label: string; value: string }[]
  value: string
  onChange: (v: string) => void
  name: string
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label>
        {label} <span className="text-destructive">*</span>
      </Label>
      <div className="flex flex-wrap gap-x-6 gap-y-2">
        {options.map((o) => (
          <label
            key={o.value}
            className="flex cursor-pointer items-center gap-2"
          >
            <input
              type="radio"
              name={name}
              className="h-4 w-4 accent-primary transition-transform duration-150 hover:scale-110"
              checked={value === o.value}
              onChange={() => onChange(o.value)}
            />
            <span className="text-sm">{o.label}</span>
          </label>
        ))}
      </div>
    </div>
  )
}

export function AddStatusReportDialog({
  projectId,
  projectName,
  open,
  onOpenChange,
  onAdded,
  existing,
}: Props) {
  const isEdit = Boolean(existing)
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [viewableBy, setViewableBy] = useState('submitter_and_members')
  const [editableBy, setEditableBy] = useState('submitter')
  const [reportDate, setReportDate] = useState(today())
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
      await statusReportsApi.remove(projectId, existing.id)
      reset()
      onOpenChange(false)
      toast.success('Status report deleted.')
      onAdded()
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setDeleting(false)
    }
  }

  function reset() {
    setTitle('')
    setSummary('')
    setViewableBy('submitter_and_members')
    setEditableBy('submitter')
    setReportDate(today())
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
        setTitle(existing.title ?? '')
        setSummary(existing.summary ?? '')
        setViewableBy(existing.viewable_by)
        setEditableBy(existing.editable_by)
        setReportDate(existing.report_date)
        setError(null)
        setFieldErrors({})
      } else {
        reset()
      }
    }
  }

  async function submit() {
    setError(null)
    setFieldErrors({})
    const errs: Record<string, string> = {}
    if (!title.trim()) errs.title = 'A title is required.'
    if (!summary.trim()) errs.summary = 'A status report is required.'
    if (!reportDate) errs.reportDate = 'A submission date is required.'

    setFieldErrors(errs)
    if (Object.keys(errs).length > 0) return

    setSaving(true)
    try {
      const payload = {
        title: title.trim(),
        summary: summary.trim(),
        viewable_by: viewableBy,
        editable_by: editableBy,
        report_date: reportDate,
      }
      if (isEdit && existing) {
        await statusReportsApi.update(projectId, existing.id, payload)
      } else {
        await statusReportsApi.add(projectId, payload)
      }
      reset()
      onOpenChange(false)
      toast.success(isEdit ? 'Status report updated.' : 'Status report added.')
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
          <DialogTitle>
            {isEdit ? 'Edit Status Report' : 'Add Status Report'}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label>
              Project <span className="text-destructive">*</span>
            </Label>
            <Input value={projectName} readOnly disabled />
          </div>

          <div className="flex flex-col gap-2">
            <Label>
              Title <span className="text-destructive">*</span>
            </Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)}  aria-invalid={fieldErrors.title ? true : undefined} />
            <FieldError message={fieldErrors.title} />
          </div>

          <div className="flex flex-col gap-2">
            <Label>
              Status Report <span className="text-destructive">*</span>
            </Label>
            <Textarea
              rows={8}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              aria-invalid={fieldErrors.summary ? true : undefined}
            />
            <FieldError message={fieldErrors.summary} />
          </div>

          <RadioRow
            label="Viewable By"
            name="sr-viewable"
            options={VIEWABLE_OPTIONS}
            value={viewableBy}
            onChange={setViewableBy}
          />

          <RadioRow
            label="Editable By"
            name="sr-editable"
            options={EDITABLE_OPTIONS}
            value={editableBy}
            onChange={setEditableBy}
          />

          <div className="flex flex-col gap-2 sm:w-1/2">
            <Label>
              Submission Date <span className="text-destructive">*</span>
            </Label>
            <Input
              type="date"
              value={reportDate}
              onChange={(e) => setReportDate(e.target.value)}
              aria-invalid={fieldErrors.reportDate ? true : undefined}
            />
            <FieldError message={fieldErrors.reportDate} />
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
                : 'Add Status Report'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}