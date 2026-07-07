import { useEffect, useState } from 'react'
import type { ProjectMemberInput } from '@/pages/CreateProjectWizard'
import { lookupsApi, rolesApi, peopleApi, type Lookup } from '@/lib/api'
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

const NEW_ROLE = '__new_role__'
const ACCESS_LEVELS = [
  { label: 'Read Only', value: 'read_only' },
  { label: 'Read / Write', value: 'read_write' },
  { label: 'Read / Write (with Admin)', value: 'read_write_admin' },
]

interface Props {
  projectId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdded: () => void
}

function emptyPerson(): ProjectMemberInput {
  return { user_id: null, display_name: '', email: null, role_id: null }
}

export function AddPersonDialog({ projectId, open, onOpenChange, onAdded }: Props) {
  const [roles, setRoles] = useState<Lookup[]>([])
  const [levels, setLevels] = useState<Lookup[]>([])
  const [person, setPerson] = useState<ProjectMemberInput>(emptyPerson())
  const [roleId, setRoleId] = useState<string | null>(null)
  const [accessLevel, setAccessLevel] = useState('read_only')
  const [involvementId, setInvolvementId] = useState<string | null>(null)
  const [notes, setNotes] = useState('')
  const [newRoleName, setNewRoleName] = useState('')
  const [newRoleLevel, setNewRoleLevel] = useState('read_only')
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open) return
    lookupsApi.list('project-roles').then(setRoles).catch(() => {})
    lookupsApi.list('involvement-levels').then(setLevels).catch(() => {})
  }, [open])

  function reset() {
    setPerson(emptyPerson())
    setRoleId(null)
    setAccessLevel('read_only')
    setInvolvementId(null)
    setNotes('')
    setNewRoleName('')
    setNewRoleLevel('read_only')
    setError(null)
  }

  async function submit() {
    setError(null)
    if (!person.display_name.trim()) return setError('A user is required.')
    if (!roleId) return setError('A project role is required.')

    setSaving(true)
    try {
      let finalRoleId = roleId
      if (roleId === NEW_ROLE) {
        if (!newRoleName.trim()) {
          setSaving(false)
          return setError('Enter a name for the new role.')
        }
        const created = await rolesApi.create(newRoleName.trim(), newRoleLevel)
        finalRoleId = created.id
      }
      await peopleApi.add(projectId, {
        user_id: person.user_id ?? undefined,
        pending_name: person.user_id ? undefined : person.display_name.trim(),
        role_id: finalRoleId,
        access_level: accessLevel,
        involvement_level_id: involvementId ?? undefined,
        notes: notes.trim() || undefined,
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
          <DialogTitle>Person</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label>
              User <span className="text-destructive">*</span>
            </Label>
            <PersonAutocomplete
              value={person}
              onChange={(p) => setPerson((cur) => ({ ...cur, ...p }))}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex flex-col gap-2">
              <Label>
                Project Role <span className="text-destructive">*</span>
              </Label>
              <Select
                items={[
                  ...roles.map((r) => ({ label: r.name, value: r.id })),
                  { label: '- New Role -', value: NEW_ROLE },
                ]}
                value={roleId ?? undefined}
                onValueChange={setRoleId}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="- Select Role -" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((r) => (
                    <SelectItem key={r.id} value={r.id}>
                      {r.name}
                    </SelectItem>
                  ))}
                  <SelectItem value={NEW_ROLE}>- New Role -</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label>
                Access Level <span className="text-destructive">*</span>
              </Label>
              <Select
                items={ACCESS_LEVELS}
                value={accessLevel}
                onValueChange={setAccessLevel}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ACCESS_LEVELS.map((a) => (
                    <SelectItem key={a.value} value={a.value}>
                      {a.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Involvement Level</Label>
              <Select
                items={levels.map((l) => ({ label: l.name, value: l.id }))}
                value={involvementId ?? undefined}
                onValueChange={setInvolvementId}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="- Select Level -" />
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

          {roleId === NEW_ROLE && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label>New Role</Label>
                <Input
                  value={newRoleName}
                  placeholder="New Role Title"
                  onChange={(e) => setNewRoleName(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>New Role Default Access Level</Label>
                <Select
                  items={ACCESS_LEVELS}
                  value={newRoleLevel}
                  onValueChange={setNewRoleLevel}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ACCESS_LEVELS.map((a) => (
                      <SelectItem key={a.value} value={a.value}>
                        {a.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Label>Notes</Label>
            <Textarea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
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
            {saving ? 'Adding…' : 'Add Person'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}