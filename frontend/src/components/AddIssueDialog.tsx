import { Loader2 } from 'lucide-react'
import { toast } from '@/lib/toast'
import { useEffect, useState } from 'react'
import type { ProjectMemberInput } from '@/pages/CreateProjectWizard'
import { lookupsApi, issuesApi, type Lookup, type Issue } from '@/lib/api'
import { useAuth } from '@/lib/auth-context'
import { PersonAutocomplete } from '@/components/PersonAutocomplete'
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

const NO_ROLE = '__no_role__'

const ROLE_HELP =
  "Use this to assign an issue's owner based on the roles of the people " +
  'associated with the project. If a role is selected here, any people with ' +
  "that role for this project will be listed as this issue's owner(s). " +
  'Leave blank to manually assign an owner to the issue.'

function emptyPerson(): ProjectMemberInput {
  return { user_id: null, display_name: '', email: null, role_id: null }
}

function HelpDot({ text }: { text: string }) {
  return (
    <span
      title={text}
      className="inline-flex h-4 w-4 cursor-help items-center justify-center rounded-full border text-[10px] text-muted-foreground"
    >
      ?
    </span>
  )
}

interface Props {
  projectId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdded: () => void
  existing?: Issue | null
}

export function AddIssueDialog({
  projectId,
  open,
  onOpenChange,
  onAdded,
  existing,
}: Props) {
  const isEdit = Boolean(existing)
  const { user } = useAuth()

  const [roles, setRoles] = useState<Lookup[]>([])
  const [levels, setLevels] = useState<Lookup[]>([])
  const [categories, setCategories] = useState<Lookup[]>([])

  const [title, setTitle] = useState('')
  const [roleId, setRoleId] = useState<string | null>(null)
  const [owner, setOwner] = useState<ProjectMemberInput>(emptyPerson())
  const [status, setStatus] = useState<'open' | 'closed'>('open')
  const [levelId, setLevelId] = useState<string | null>(null)
  const [categoryId, setCategoryId] = useState<string | null>(null)
  const [description, setDescription] = useState('')
  const [url, setUrl] = useState('')
  const [referenceId, setReferenceId] = useState('')
  const [tags, setTags] = useState('')
  const [resolution, setResolution] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const busy = saving || deleting

  async function remove() {
    if (!existing) return
    setError(null)
    setDeleting(true)
    try {
      await issuesApi.remove(projectId, existing.id)
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
    lookupsApi.list('project-roles').then(setRoles).catch(() => toast.error('Could not load project roles.'))
    lookupsApi.list('issue-levels').then(setLevels).catch(() => toast.error('Could not load issue levels.'))
    lookupsApi.list('issue-categories').then(setCategories).catch(() => toast.error('Could not load issue categories.'))
  }, [open])

  function reset() {
    setTitle('')
    setRoleId(null)
    setOwner(emptyPerson())
    setStatus('open')
    setLevelId(null)
    setCategoryId(null)
    setDescription('')
    setUrl('')
    setReferenceId('')
    setTags('')
    setResolution('')
    setError(null)
  }

  // Populate on open / record change — render-phase prev-key pattern.
  const populateKey = open ? (existing?.id ?? '__new__') : null
  const [prevPopulateKey, setPrevPopulateKey] = useState<string | null>(null)
  if (prevPopulateKey !== populateKey) {
    setPrevPopulateKey(populateKey)
    if (populateKey !== null) {
      if (existing) {
        setTitle(existing.title)
        setRoleId(existing.role_id)
        setOwner(
          existing.owner_id
            ? {
                user_id: existing.owner_id,
                display_name:
                  existing.owner?.full_name || existing.owner?.email || '',
                email: existing.owner?.email ?? null,
                role_id: null,
              }
            : emptyPerson(),
        )
        setStatus(existing.status === 'closed' ? 'closed' : 'open')
        setLevelId(existing.level_id)
        setCategoryId(existing.category_id)
        setDescription(existing.description ?? '')
        setUrl(existing.url ?? '')
        setReferenceId(existing.reference_identifier ?? '')
        setTags(existing.tags?.join(', ') ?? '')
        setResolution(existing.resolution ?? '')
      } else {
        reset()
      }
      setError(null)
    }
  }

  function setMe() {
    if (!user) return
    const fullName =
      (user.user_metadata?.full_name as string | undefined) ||
      user.email ||
      ''
    setOwner({
      user_id: user.id,
      display_name: fullName,
      email: user.email ?? null,
      role_id: null,
    })
  }

  async function submit() {
    setError(null)
    if (!title.trim()) return setError('An issue title is required.')
    if (status === 'closed' && !resolution.trim())
      return setError('Resolution / Mitigation is required when the issue is closed.')

    setSaving(true)
    try {
      const tagList = tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)

      const payload = {
        title: title.trim(),
        role_id: roleId,
        owner_id: owner.user_id,
        status,
        level_id: levelId,
        category_id: categoryId,
        description: description.trim() || null,
        url: url.trim() || null,
        reference_identifier: referenceId.trim() || null,
        tags: tagList.length ? tagList : null,
        resolution: status === 'closed' ? resolution.trim() : null,
      }

      if (isEdit && existing) {
        await issuesApi.update(projectId, existing.id, payload)
      } else {
        await issuesApi.add(projectId, payload)
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
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Issue</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label>
              Issue <span className="text-destructive">*</span>
            </Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-1.5">
                <Label>Assign to Role</Label>
                <HelpDot text={ROLE_HELP} />
              </div>
              <Select
                items={[
                  { label: '- No Role -', value: NO_ROLE },
                  ...roles.map((r) => ({ label: r.name, value: r.id })),
                ]}
                value={roleId ?? NO_ROLE}
                onValueChange={(v) => setRoleId(v === NO_ROLE ? null : v)}
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
              <Label>Issue Owner</Label>
              <div className="flex items-start gap-2">
                <div className="flex-1">
                  <PersonAutocomplete
                    value={owner}
                    onChange={(p) => setOwner((cur) => ({ ...cur, ...p }))}
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={setMe}
                >
                  Me
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label>Status</Label>
              <div className="flex items-center gap-6 pt-1">
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    name="issue-status"
                    className="h-4 w-4 accent-primary transition-transform duration-150 hover:scale-110"
                    checked={status === 'open'}
                    onChange={() => setStatus('open')}
                  />
                  <span className="text-sm font-medium">Open</span>
                </label>
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    name="issue-status"
                    className="h-4 w-4 accent-primary transition-transform duration-150 hover:scale-110"
                    checked={status === 'closed'}
                    onChange={() => setStatus('closed')}
                  />
                  <span className="text-sm font-medium">Closed</span>
                </label>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Level</Label>
              <Select
                items={levels.map((l) => ({ label: l.name, value: l.id }))}
                value={levelId ?? ''}
                onValueChange={(v) => setLevelId(v ?? null)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="- Select -" />
                </SelectTrigger>
                <SelectContent>
                  {levels.map((l) => (
                    <SelectItem key={l.id} value={l.id}>
                      {l.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label>Category</Label>
              <Select
                items={categories.map((c) => ({ label: c.name, value: c.id }))}
                value={categoryId ?? ''}
                onValueChange={(v) => setCategoryId(v ?? null)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="- Select -" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-1.5">
                <Label>Reference Identifier</Label>
                <HelpDot text="An external ticket or tracking number for this issue (e.g. from your service desk or task tracker)." />
              </div>
              <Input
                value={referenceId}
                onChange={(e) => setReferenceId(e.target.value)}
              />
            </div>
          </div>

          {status === 'closed' && (
            <div className="flex flex-col gap-2">
              <Label>
                Resolution / Mitigation{' '}
                <span className="text-destructive">*</span>
              </Label>
              <Textarea
                rows={3}
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
              />
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Label>Description</Label>
            <Textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>URL</Label>
            <Input value={url} onChange={(e) => setUrl(e.target.value)} />
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
                : 'Add Issue'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}