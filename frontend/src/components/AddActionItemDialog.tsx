import { useEffect, useState } from 'react'
import type { ProjectMemberInput } from '@/pages/CreateProjectWizard'
import {
  lookupsApi,
  milestonesApi,
  actionItemsApi,
  type Lookup,
  type Milestone,
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

const NO_MILESTONE = '__no_milestone__'
const NO_ROLE = '__no_role__'
const NO_TYPE = '__no_type__'
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

export function AddActionItemDialog({
  projectId,
  open,
  onOpenChange,
  onAdded,
}: Props) {
  const { user } = useAuth()
  const [roles, setRoles] = useState<Lookup[]>([])
  const [types, setTypes] = useState<Lookup[]>([])
  const [milestones, setMilestones] = useState<Milestone[]>([])

  const [title, setTitle] = useState('')
  const [milestoneId, setMilestoneId] = useState<string | null>(null)
  const [dueDate, setDueDate] = useState(today())
  const [status, setStatus] = useState('open')
  const [typeId, setTypeId] = useState<string | null>(null)
  const [roleId, setRoleId] = useState<string | null>(null)
  const [owners, setOwners] = useState<ProjectMemberInput[]>([
    emptyOwner(),
    emptyOwner(),
    emptyOwner(),
    emptyOwner(),
  ])
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open) return
    lookupsApi.list('project-roles').then(setRoles).catch(() => {})
    lookupsApi.list('action-item-types').then(setTypes).catch(() => {})
    milestonesApi.list(projectId).then(setMilestones).catch(() => {})
  }, [open, projectId])

  function reset() {
    setTitle('')
    setMilestoneId(null)
    setDueDate(today())
    setStatus('open')
    setTypeId(null)
    setRoleId(null)
    setOwners([emptyOwner(), emptyOwner(), emptyOwner(), emptyOwner()])
    setDescription('')
    setTags('')
    setError(null)
  }

  function setOwnerAt(index: number, patch: Partial<ProjectMemberInput>) {
    setOwners((cur) =>
      cur.map((o, i) => (i === index ? { ...o, ...patch } : o)),
    )
  }

  function setMe() {
    setOwnerAt(0, {
      user_id: user?.id ?? null,
      display_name: user?.email ?? '',
      email: user?.email ?? null,
    })
  }

  async function submit() {
    setError(null)
    if (!title.trim()) return setError('An action is required.')
    if (!dueDate) return setError('A due date is required.')

    const ownerIds = [
      ...new Set(
        owners
          .map((o) => o.user_id)
          .filter((id): id is string => Boolean(id)),
      ),
    ].slice(0, 4)

    setSaving(true)
    try {
      const tagList = tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)

      await actionItemsApi.add(projectId, {
        title: title.trim(),
        milestone_id: milestoneId ?? undefined,
        due_date: dueDate,
        status,
        type_id: typeId ?? undefined,
        role_id: roleId ?? undefined,
        description: description.trim() || undefined,
        tags: tagList.length ? tagList : undefined,
        owner_ids: ownerIds.length ? ownerIds : undefined,
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
          <DialogTitle>Action Item</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label>
              Action <span className="text-destructive">*</span>
            </Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Milestone</Label>
            <Select
              items={[
                { label: '- No Milestone -', value: NO_MILESTONE },
                ...milestones.map((m) => ({ label: m.name, value: m.id })),
              ]}
              value={milestoneId ?? NO_MILESTONE}
              onValueChange={(v) =>
                setMilestoneId(v === NO_MILESTONE ? null : (v ?? null))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="- No Milestone -" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NO_MILESTONE}>- No Milestone -</SelectItem>
                {milestones.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label>Status</Label>
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
              <Label>Type</Label>
              <Select
                items={[
                  { label: '- No Type -', value: NO_TYPE },
                  ...types.map((t) => ({ label: t.name, value: t.id })),
                ]}
                value={typeId ?? NO_TYPE}
                onValueChange={(v) => setTypeId(v === NO_TYPE ? null : (v ?? null))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="- No Type -" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NO_TYPE}>- No Type -</SelectItem>
                  {types.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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

          {owners.map((owner, i) => (
            <div key={i} className="flex flex-col gap-2">
              <Label>Owner {i + 1}</Label>
              <div className="flex items-start gap-2">
                <div className="flex-1">
                  <PersonAutocomplete
                    value={owner}
                    onChange={(p) => setOwnerAt(i, p)}
                  />
                </div>
                {i === 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={setMe}
                  >
                    [Me]
                  </Button>
                )}
              </div>
            </div>
          ))}

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
            {saving ? 'Adding…' : 'Add Action Item'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}