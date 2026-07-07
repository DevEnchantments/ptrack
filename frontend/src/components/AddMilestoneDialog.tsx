import { useEffect, useState } from 'react'
import type { ProjectMemberInput } from '@/pages/CreateProjectWizard'
import { lookupsApi, milestonesApi, type Lookup } from '@/lib/api'
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

interface Props {
  projectId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdded: () => void
}

export function AddMilestoneDialog({
  projectId,
  open,
  onOpenChange,
  onAdded,
}: Props) {
  const { user } = useAuth()
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
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open) return
    lookupsApi.list('project-roles').then(setRoles).catch(() => {})
  }, [open])

  function reset() {
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
    setError(null)
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
    if (!name.trim()) return setError('A milestone name is required.')
    if (!startDate) return setError('A start date is required.')
    if (!dueDate) return setError('A due date is required.')

    setSaving(true)
    try {
      const tagList = tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)

      await milestonesApi.add(projectId, {
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
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Milestone</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label>
              Milestone <span className="text-destructive">*</span>
            </Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
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
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>
                Due Date <span className="text-destructive">*</span>
              </Label>
              <Input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
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
            {saving ? 'Adding…' : 'Add Milestone'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}