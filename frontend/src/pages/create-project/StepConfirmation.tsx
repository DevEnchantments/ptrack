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
  const [tiers, setTiers] = useState<Lookup[]>([])
  const [sectors, setSectors] = useState<Lookup[]>([])
  const [objectives, setObjectives] = useState<Lookup[]>([])

  useEffect(() => {
    lookupsApi.list('project-statuses').then(setStatuses).catch(() => toast.error('Could not load project statuses.'))
    lookupsApi.list('project-roles').then(setRoles).catch(() => toast.error('Could not load project roles.'))
    lookupsApi.list('tiers').then(setTiers).catch(() => toast.error('Could not load tiers.'))
    lookupsApi.list('sectors').then(setSectors).catch(() => toast.error('Could not load sectors.'))
    lookupsApi.list('strategic-objectives').then(setObjectives).catch(() => toast.error('Could not load strategic objectives.'))
  }, [])

  const statusName = statuses.find((s) => s.id === form.status_id)?.name ?? '-'
  const tierName = tiers.find((t) => t.id === form.tier_id)?.name
  const sectorName =
    form.sector_id === '__new_sector__'
      ? `${form.new_sector.trim()} (new)`
      : sectors.find((sec) => sec.id === form.sector_id)?.name
  const objectiveName = objectives.find(
    (o) => o.id === form.strategic_objective_id,
  )?.name
  const accessLabel =
    form.access_control === 'open'
      ? 'Open'
      : 'Restricted – Only Accessible by Associated People'
  const roleName = (id: string | null) =>
    roles.find((r) => r.id === id)?.name ?? '-'
  const members = form.members.filter((m) => m.display_name.trim() && m.role_id)

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm text-muted-foreground">
        Review the details below, then create the project.
      </p>
      <dl className="divide-y rounded-md border bg-card">
        <Row label="Project" value={form.name || '-'} />
        <Row label="Status" value={statusName} />
        <Row label="Access Control" value={accessLabel} />
        <Row label="Start Date" value={form.start_date || '-'} />
        <Row label="End Date" value={form.target_end_date || '-'} />
        <Row label="Sponsor" value={form.sponsor.trim() || '-'} />
        <Row label="Sector" value={sectorName || '-'} />
        {form.reference_id.trim() && (
          <Row label="Reference ID" value={form.reference_id.trim()} />
        )}
        {form.project_number.trim() && (
          <Row label="Project Number" value={form.project_number.trim()} />
        )}
        {form.plan_year.trim() && (
          <Row label="Plan Year" value={form.plan_year.trim()} />
        )}
        {objectiveName && (
          <Row label="Strategic Objective" value={objectiveName} />
        )}
        {tierName && <Row label="Tier" value={tierName} />}
        {form.approved_budget.trim() && (
          <Row
            label="Approved Budget"
            value={`AED ${Number(form.approved_budget).toLocaleString()}`}
          />
        )}
        {form.utilized_budget.trim() && (
          <Row
            label="Utilized Budget"
            value={`AED ${Number(form.utilized_budget).toLocaleString()}`}
          />
        )}
        {form.finance_code.trim() && (
          <Row label="Finance Code" value={form.finance_code.trim()} />
        )}
        {form.internal_stakeholder.trim() && (
          <Row
            label="Internal Stakeholder"
            value={form.internal_stakeholder.trim()}
          />
        )}
        {form.target_group.trim() && (
          <Row label="Target Group" value={form.target_group.trim()} />
        )}
        {form.is_priority && <Row label="Priority" value="Yes" />}
        <Row
          label="Project Owner(s)"
          value={
            members.length === 0 ? (
              '-'
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
                      <span className="text-gold"> (pending)</span>
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