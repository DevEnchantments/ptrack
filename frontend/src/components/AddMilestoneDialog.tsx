import { FieldError } from '@/components/FieldError'
import { Loader2 } from 'lucide-react'
import { toast } from '@/lib/toast'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { ProjectMemberInput } from '@/pages/CreateProjectWizard'
import {
  lookupsApi,
  milestonesApi,
  type Lookup,
  type MilestoneDetail,
} from '@/lib/api'
import { useAuth } from '@/lib/auth-context'
import { PersonAutocomplete } from '@/components/PersonAutocomplete'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const NO_ROLE = '__no_role__'
const STATUSES = [
  { label: 'Open', value: 'open' },
  { label: 'Closed / Completed', value: 'closed_completed' },
  { label: 'Not Applicable', value: 'not_applicable' },
]

function today(): string {
  return new Date().toISOString().slice(0, 10)
}

function emptyOwner(): ProjectMemberInput {
  return { user_id: null, display_name: '', email: null, role_id: null }
}

function ownerFromMilestone(m: MilestoneDetail): ProjectMemberInput {
  return {
    user_id: m.owner_id,
    display_name: m.owner?.full_name || m.owner?.email || '',
    email: m.owner?.email ?? null,
    role_id: null,
  }
}

function profileName(
  p?: { full_name: string | null; email: string | null } | null,
): string {
  return p?.full_name || p?.email || 'Unknown'
}

interface Props {
  projectId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdded: () => void
  existing?: MilestoneDetail | null
  onDeleted?: () => void
}

export function AddMilestoneDialog({
  projectId,
  open,
  onOpenChange,
  onAdded,
  existing,
  onDeleted,
}: Props) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const isEdit = Boolean(existing)

  const [roles, setRoles] = useState<Lookup[]>([])
  const [name, setName] = useState('')
  const [startDate, setStartDate] = useState(today())
  const [dueDate, setDueDate] = useState(today())
  const [status, setStatus] = useState('open')
  const [roleId, setRoleId] = useState<string | null>(null)
  const [owner, setOwner] = useState<ProjectMemberInput>(emptyOwner())
  const [isMajor, setIsMajor] = useState('false')
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState('')
  const [weightage, setWeightage] = useState('')
  const [percent, setPercent] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (!open) return
    lookupsApi.list('project-roles').then(setRoles).catch(() => toast.error('Could not load project roles.'))
  }, [open])

  function resetFields() {
    setName('')
    setStartDate(today())
    setDueDate(today())
    setStatus('open')
    setRoleId(null)
    setOwner(emptyOwner())
    setIsMajor('false')
    setDescription('')
    setTags('')
    setWeightage('')
    setPercent('')
  }

  // Populate on open / record change — render-phase prev-key pattern.
  const populateKey = open ? (existing?.id ?? '__new__') : null
  const [prevPopulateKey, setPrevPopulateKey] = useState<string | null>(null)
  if (prevPopulateKey !== populateKey) {
    setPrevPopulateKey(populateKey)
    if (populateKey !== null) {
      if (existing) {
        setName(existing.name)
        setStartDate(existing.start_date ?? today())
        setDueDate(existing.due_date ?? today())
        setStatus(existing.status)
        setRoleId(existing.role_id)
        setOwner(ownerFromMilestone(existing))
        setIsMajor(existing.is_major ? 'true' : 'false')
        setDescription(existing.description ?? '')
        setTags(existing.tags?.join(', ') ?? '')
        setWeightage(
          existing.weightage === null || existing.weightage === undefined
            ? ''
            : String(existing.weightage),
        )
        setPercent(
          existing.percent_complete === null ||
            existing.percent_complete === undefined
            ? ''
            : String(existing.percent_complete),
        )
      } else {
        resetFields()
      }
      setError(null)
      setFieldErrors({})
      setConfirmDelete(false)
    }
  }

  function reset() {
    resetFields()
    setError(null)
    setFieldErrors({})
    setConfirmDelete(false)
  }

  function setMe() {
    setOwner({
      user_id: user?.id ?? null,
      display_name: user?.email ?? '',
      email: user?.email ?? null,
      role_id: null,
    })
  }

  async function submit() {
    setError(null)
    setFieldErrors({})
    const errs: Record<string, string> = {}
    if (!name.trim()) errs.name = 'A milestone name is required.'
    if (!startDate) errs.startDate = 'A start date is required.'
    if (!dueDate) errs.dueDate = 'A due date is required.'

    setFieldErrors(errs)
    if (Object.keys(errs).length > 0) return

    setSaving(true)
    try {
      const tagList = tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)

      const payload = {
        name: name.trim(),
        start_date: startDate,
        due_date: dueDate,
        status,
        role_id: roleId ?? undefined,
        owner_id: owner.user_id ?? undefined,
        is_major: isMajor === 'true',
        description: description.trim() || undefined,
        tags: tagList.length ? tagList : undefined,
        weightage: weightage.trim() ? Number(weightage) : undefined,
        percent_complete: percent.trim() ? Number(percent) : undefined,
      }

      if (isEdit && existing) {
        await milestonesApi.update(projectId, existing.id, payload)
      } else {
        await milestonesApi.add(projectId, payload)
      }
      reset()
      onOpenChange(false)
      toast.success(isEdit ? 'Milestone updated.' : 'Milestone added.')
      onAdded()
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setSaving(false)
    }
  }

  async function doDelete() {
    if (!existing) return
    setError(null)
    setFieldErrors({})
    setDeleting(true)
    try {
      await milestonesApi.remove(projectId, existing.id)
      reset()
      onOpenChange(false)
      toast.success('Milestone deleted.')
      if (onDeleted) onDeleted()
      else onAdded()
    } catch (e) {
      setError((e as Error).message)
      setConfirmDelete(false)
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
          <DialogTitle>Milestone</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label>
              Milestone <span className="text-destructive">*</span>
            </Label>
            <Input value={name} onChange={(e) => setName(e.target.value)}  aria-invalid={fieldErrors.name ? true : undefined} />
            <FieldError message={fieldErrors.name} />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label>
                Milestone Start Date <span className="text-destructive">*</span>
              </Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                aria-invalid={fieldErrors.startDate ? true : undefined}
              />
              <FieldError message={fieldErrors.startDate} />
            </div>
            <div className="flex flex-col gap-2">
              <Label>
                Due Date <span className="text-destructive">*</span>
              </Label>
              <Input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                aria-invalid={fieldErrors.dueDate ? true : undefined}
              />
              <FieldError message={fieldErrors.dueDate} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex flex-col gap-2">
              <Label>
                Status <span className="text-destructive">*</span>
              </Label>
              <Select
                items={STATUSES}
                value={status}
                onValueChange={(v) => setStatus(v ?? 'open')}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Assign to Role</Label>
              <Select
                items={[
                  { label: '- No Role -', value: NO_ROLE },
                  ...roles.map((r) => ({ label: r.name, value: r.id })),
                ]}
                value={roleId ?? NO_ROLE}
                onValueChange={(v) => setRoleId(v === NO_ROLE ? null : (v ?? null))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="- No Role -" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NO_ROLE}>- No Role -</SelectItem>
                  {roles.map((r) => (
                    <SelectItem key={r.id} value={r.id}>
                      {r.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Is Major Milestone</Label>
              <Select
                items={[
                  { label: 'No', value: 'false' },
                  { label: 'Yes', value: 'true' },
                ]}
                value={isMajor}
                onValueChange={(v) => setIsMajor(v ?? 'false')}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="false">No</SelectItem>
                  <SelectItem value="true">Yes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Owner</Label>
            <div className="flex items-start gap-2">
              <div className="flex-1">
                <PersonAutocomplete
                  value={owner}
                  onChange={(p) => setOwner((cur) => ({ ...cur, ...p }))}
                />
              </div>
              <Button type="button" variant="outline" size="sm" onClick={setMe}>
                [Me]
              </Button>
            </div>
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

          <div className="rounded-md border p-4">
            <p className="mb-3 text-sm font-medium text-muted-foreground">
              Additional Data
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label>Weightage</Label>
                <Input
                  type="number"
                  value={weightage}
                  onChange={(e) => setWeightage(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>% of Completion</Label>
                <Input
                  type="number"
                  value={percent}
                  onChange={(e) => setPercent(e.target.value)}
                />
              </div>
            </div>
          </div>

          {isEdit && existing && (
            <div className="border-t pt-3 text-xs text-muted-foreground">
              {existing.created_at && (
                <div>
                  Created {new Date(existing.created_at).toLocaleString()} by{' '}
                  {profileName(existing.created_by_profile)}
                </div>
              )}
              {existing.updated_at && (
                <div>
                  Last updated {new Date(existing.updated_at).toLocaleString()}{' '}
                  by {profileName(existing.updated_by_profile)}
                </div>
              )}
              <button
                type="button"
                onClick={() => {
                  onOpenChange(false)
                  navigate(`/projects/${projectId}`)
                }}
                className="mt-1 text-primary hover:underline"
              >
                View Project
              </button>
            </div>
          )}

          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <DialogFooter className="sm:justify-between">
          <div>
            {isEdit &&
              (confirmDelete ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-destructive">Delete?</span>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={doDelete}
                    disabled={busy}
                  >
                    {deleting ? 'Deleting…' : 'Confirm'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setConfirmDelete(false)}
                    disabled={busy}
                  >
                    No
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive"
                  onClick={() => setConfirmDelete(true)}
                  disabled={busy}
                >
                  Delete
                </Button>
              ))}
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
                  : 'Adding…'
                : isEdit
                  ? 'Apply Changes'
                  : 'Add Milestone'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}