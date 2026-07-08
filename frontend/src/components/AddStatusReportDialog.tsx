import { useEffect, useState } from 'react'
import { statusReportsApi } from '@/lib/api'
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
              className="h-4 w-4 accent-primary"
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
}: Props) {
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [viewableBy, setViewableBy] = useState('submitter_and_members')
  const [editableBy, setEditableBy] = useState('submitter')
  const [reportDate, setReportDate] = useState(today())
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open) return
    reset()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  function reset() {
    setTitle('')
    setSummary('')
    setViewableBy('submitter_and_members')
    setEditableBy('submitter')
    setReportDate(today())
    setError(null)
  }

  async function submit() {
    setError(null)
    if (!title.trim()) return setError('A title is required.')
    if (!summary.trim()) return setError('A status report is required.')
    if (!reportDate) return setError('A submission date is required.')

    setSaving(true)
    try {
      await statusReportsApi.add(projectId, {
        title: title.trim(),
        summary: summary.trim(),
        viewable_by: viewableBy,
        editable_by: editableBy,
        report_date: reportDate,
      })
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
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Status Report</DialogTitle>
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
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div className="flex flex-col gap-2">
            <Label>
              Status Report <span className="text-destructive">*</span>
            </Label>
            <Textarea
              rows={8}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
            />
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
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              reset()
              onOpenChange(false)
            }}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button onClick={submit} disabled={saving}>
            {saving ? 'Adding…' : 'Add Status Report'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}