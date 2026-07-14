import { toast } from '@/lib/toast'
import { useEffect, useState } from 'react'
import type { CreateProjectForm, ProjectMemberInput } from '../CreateProjectWizard'
import { emptyMember } from '../CreateProjectWizard'
import { lookupsApi, type Lookup } from '@/lib/api'
import { Label } from '@/components/ui/label'
import { PersonAutocomplete } from '@/components/PersonAutocomplete'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface Props {
  form: CreateProjectForm
  errors: Record<string, string>
  update: (patch: Partial<CreateProjectForm>) => void
}

export function StepAccess({ form, errors, update }: Props) {
  const [roles, setRoles] = useState<Lookup[]>([])

  useEffect(() => {
    lookupsApi
      .list('project-roles')
      .then((r) => {
        setRoles(r)
        // Default row 1's role to Project Manager, matching the demo.
        const pm = r.find((x) => x.name === 'Project Manager')
        if (pm && form.members[0] && !form.members[0].role_id) {
          update({
            members: form.members.map((m, i) =>
              i === 0 ? { ...m, role_id: pm.id } : m,
            ),
          })
        }
      })
      .catch(() => toast.error('Could not load project roles.'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Keep exactly one trailing empty row: grow when the last row is used,
  // shrink when trailing rows pile up empty. Never drop below MIN_ROWS.
  useEffect(() => {
    const MIN_ROWS = 3
    const isEmpty = (m: ProjectMemberInput) =>
      !m.display_name.trim() && !m.role_id

    const members = form.members
    const last = members[members.length - 1]

    // Grow: last row has content → append a blank.
    if (last && !isEmpty(last)) {
      update({ members: [...members, emptyMember()] })
      return
    }

    // Shrink: count trailing empties, keep just one (respecting the minimum).
    let trailing = 0
    for (let i = members.length - 1; i >= 0 && isEmpty(members[i]); i--) {
      trailing++
    }
    if (trailing > 1) {
      const target = Math.max(MIN_ROWS, members.length - (trailing - 1))
      if (target < members.length) {
        update({ members: members.slice(0, target) })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.members])

  function updateMember(index: number, patch: Partial<ProjectMemberInput>) {
    update({
      members: form.members.map((m, i) => (i === index ? { ...m, ...patch } : m)),
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Label>
          Access Control <span className="text-destructive">*</span>
        </Label>
        <Select
          items={[
            { label: 'Open', value: 'open' },
            {
              label: 'Restricted – Only Accessible by Associated People',
              value: 'restricted',
            },
          ]}
          value={form.access_control}
          onValueChange={(v) =>
            update({ access_control: v as 'open' | 'restricted' })
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="restricted">
              Restricted – Only Accessible by Associated People
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-4">
          <Label>
            Person <span className="text-destructive">*</span>
          </Label>
          <Label>
            Project Role <span className="text-destructive">*</span>
          </Label>
        </div>

        {form.members.map((m, i) => (
          <div key={i} className="grid grid-cols-2 items-start gap-4">
            <PersonAutocomplete
              value={m}
              onChange={(patch) => updateMember(i, patch)}
            />
            <Select
              items={roles.map((r) => ({ label: r.name, value: r.id }))}
              value={m.role_id ?? undefined}
              onValueChange={(v) => updateMember(i, { role_id: v })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((r) => (
                  <SelectItem key={r.id} value={r.id}>
                    {r.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}

        {errors.members && (
          <p className="text-sm text-destructive">{errors.members}</p>
        )}
      </div>
    </div>
  )
}