import { useEffect, useState } from 'react'
import type { ProjectMemberInput } from '@/pages/CreateProjectWizard'
import { useNavigate } from 'react-router-dom'
import {
  lookupsApi,
  milestonesApi,
  actionItemsApi,
  type Lookup,
  type Milestone,
  type ActionItem,
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

function ownerFromItem(o: ActionItem['owners'][number]): ProjectMemberInput {
  return {
    user_id: o.user_id,
    display_name: o.profile?.full_name || o.profile?.email || '',
    email: o.profile?.email ?? null,
    role_id: null,
  }
}

function ownersFromItem(item: ActionItem): ProjectMemberInput[] {
  const sorted = item.owners.slice().sort((a, b) => a.slot - b.slot)
  const slots = sorted.map(ownerFromItem)
  while (slots.length < 4) slots.push(emptyOwner())
  return slots.slice(0, 4)
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
  onSaved: () => void
  existing?: ActionItem | null
  onDeleted?: () => void
}

export function AddActionItemDialog({
  projectId,
  open,
  onOpenChange,
  onSaved,
  existing,
  onDeleted,
}: Props) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const isEdit = Boolean(existing)

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
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (!open) return
    lookupsApi.list('project-roles').then(setRoles).catch(() => {})
    lookupsApi.list('action-item-types').then(setTypes).catch(() => {})
    milestonesApi.list(projectId).then(setMilestones).catch(() => {})
  }, [open, projectId])

  useEffect(() => {
    if (!open) return
    if (existing) {
      setTitle(existing.title)
      setMilestoneId(existing.milestone_id)
      setDueDate(existing.due_date ?? today())
      setStatus(existing.status)
      setTypeId(existing.type_id)
      setRoleId(existing.role_id)
      setOwners(ownersFromItem(existing))
      setDescription(existing.description ?? '')
      setTags(existing.tags?.join(', ') ?? '')
    } else {
      resetFields()
    }
    setError(null)
    setConfirmDelete(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, existing])

  function resetFields() {
    setTitle('')
    setMilestoneId(null)
    setDueDate(today())
    setStatus('open')
    setTypeId(null)
    setRoleId(null)
    setOwners([emptyOwner(), emptyOwner(), emptyOwner(), emptyOwner()])
    setDescription('')
    setTags('')
  }

  function reset() {
    resetFields()
    setError(null)
    setConfirmDelete(false)
  }

  function setOwnerAt(index: number, patch: Partial<ProjectMemberInput>) {
    setOwners((cur) => cur.map((o, i) => (i === index ? { ...o, ...patch } : o)))
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
        owners.map((o) => o.user_id).filter((id): id is string => Boolean(id)),
      ),
    ].slice(0, 4)

    setSaving(true)
    try {
      const tagList = tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)

      const payload = {
        title: title.trim(),
        milestone_id: milestoneId ?? undefined,
        due_date: dueDate,
        status,
        type_id: typeId ?? undefined,
        role_id: roleId ?? undefined,
        description: description.trim() || undefined,
        tags: tagList.length ? tagList : undefined,
        owner_ids: ownerIds,
      }

      if (isEdit && existing) {
        await actionItemsApi.update(projectId, existing.id, payload)
      } else {
        await actionItemsApi.add(projectId, payload)
      }
      reset()
      onOpenChange(false)
      onSaved()
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setSaving(false)
    }
  }

  async function doDelete() {
    if (!existing) return
    setError(null)
    setDeleting(true)
    try {
      await actionItemsApi.remove(projectId, existing.id)
      reset()
      onOpenChange(false)
      if (onDeleted) onDeleted()
      else onSaved()
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
              {existing.due_date && (
                <div className="mt-1 font-medium text-foreground">
                  Due On: {existing.due_date}
                </div>
              )}
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
              {saving
                ? isEdit
                  ? 'Saving…'
                  : 'Adding…'
                : isEdit
                  ? 'Apply Changes'
                  : 'Add Action Item'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}