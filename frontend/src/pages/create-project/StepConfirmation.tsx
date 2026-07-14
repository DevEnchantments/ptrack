import { toast } from '@/lib/toast'
import { useEffect, useState } from 'react'
import type { CreateProjectForm } from '../CreateProjectWizard'
import { lookupsApi, type Lookup } from '@/lib/api'

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid grid-cols-3 gap-4 px-4 py-3">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="col-span-2 text-sm">{value}</dd>
    </div>
  )
}

export function StepConfirmation({ form }: { form: CreateProjectForm }) {
  const [statuses, setStatuses] = useState<Lookup[]>([])
  const [roles, setRoles] = useState<Lookup[]>([])

  useEffect(() => {
    lookupsApi.list('project-statuses').then(setStatuses).catch(() => toast.error('Could not load project statuses.'))
    lookupsApi.list('project-roles').then(setRoles).catch(() => toast.error('Could not load project roles.'))
  }, [])

  const statusName = statuses.find((s) => s.id === form.status_id)?.name ?? '—'
  const accessLabel =
    form.access_control === 'open'
      ? 'Open'
      : 'Restricted – Only Accessible by Associated People'
  const roleName = (id: string | null) =>
    roles.find((r) => r.id === id)?.name ?? '—'
  const members = form.members.filter((m) => m.display_name.trim() && m.role_id)

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        Review the details below, then create the project.
      </p>
      <dl className="divide-y rounded-md border">
        <Row label="Project" value={form.name || '—'} />
        <Row label="Status" value={statusName} />
        <Row label="Access Control" value={accessLabel} />
        <Row label="Start Date" value={form.start_date || '—'} />
        <Row
          label="Project Owner(s)"
          value={
            members.length === 0 ? (
              '—'
            ) : (
              <ul className="flex flex-col gap-1">
                {members.map((m, i) => (
                  <li key={i}>
                    {m.display_name}
                    <span className="text-muted-foreground">
                      {' '}
                      — {roleName(m.role_id)}
                    </span>
                    {!m.user_id && (
                      <span className="text-amber-600"> (pending)</span>
                    )}
                  </li>
                ))}
              </ul>
            )
          }
        />
      </dl>
    </div>
  )
}