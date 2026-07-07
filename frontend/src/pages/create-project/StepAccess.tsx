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
      .catch(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Auto-grow: keep exactly one trailing empty row. When the last row gets a
  // person or a role, append a fresh blank one.
  useEffect(() => {
    const last = form.members[form.members.length - 1]
    if (last && (last.display_name.trim() || last.role_id)) {
      update({ members: [...form.members, emptyMember()] })
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