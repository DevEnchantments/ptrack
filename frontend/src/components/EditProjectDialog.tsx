import { FieldError } from '@/components/FieldError'
import { PersonAutocomplete } from '@/components/PersonAutocomplete'
import type { ProjectMemberInput } from '@/pages/CreateProjectWizard'
import { useAuth } from '@/lib/auth-context'
import { Loader2, Star, TriangleAlert, X } from 'lucide-react'
import { toast } from '@/lib/toast'
import { useEffect, useState } from 'react'
import {
  projectsApi,
  lookupsApi,
  categoriesApi,
  sectorsApi,
  type ProjectDetail,
  type Project,
  type Lookup,
} from '@/lib/api'
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

const NONE = '__none__'

function personFromProfile(
  id: string | null,
  p?: { full_name: string | null; email: string | null } | null,
): ProjectMemberInput {
  return {
    user_id: id,
    display_name: p?.full_name || p?.email || '',
    email: p?.email ?? null,
    role_id: null,
  }
}
const NEW_CATEGORY = '__new_category__'
const NEW_SECTOR = '__new_sector__'

interface Props {
  project: ProjectDetail
  open: boolean
  onOpenChange: (open: boolean) => void
  onSaved: () => void
  onDeleted: () => void
}

export function EditProjectDialog({
  project,
  open,
  onOpenChange,
  onSaved,
  onDeleted,
}: Props) {
  const { user } = useAuth()
  const [statuses, setStatuses] = useState<Lookup[]>([])
  const [sizes, setSizes] = useState<Lookup[]>([])
  const [categories, setCategories] = useState<Lookup[]>([])
  const [tiers, setTiers] = useState<Lookup[]>([])
  const [objectives, setObjectives] = useState<Lookup[]>([])
  const [programs, setPrograms] = useState<Lookup[]>([])
  const [sectors, setSectors] = useState<Lookup[]>([])
  const [projects, setProjects] = useState<Project[]>([])

  const [name, setName] = useState('')
  const [parentId, setParentId] = useState<string | null>(null)
  const [statusId, setStatusId] = useState<string | null>(null)
  const [sizeId, setSizeId] = useState<string | null>(null)
  const [accessControl, setAccessControl] = useState('open')
  const [categoryId, setCategoryId] = useState<string | null>(null)
  const [newCategory, setNewCategory] = useState('')
  const [description, setDescription] = useState('')
  const [goal, setGoal] = useState('')
  const [tags, setTags] = useState('')
  const [customer, setCustomer] = useState('')
  const [primaryUrl, setPrimaryUrl] = useState('')
  const [startDate, setStartDate] = useState('')
  // FDD Stage-1 fields (docs/FDD-ALIGNMENT.md section 1.1)
  const [referenceId, setReferenceId] = useState('')
  const [projectNumber, setProjectNumber] = useState('')
  const [planYear, setPlanYear] = useState('')
  const [financeCode, setFinanceCode] = useState('')
  const [targetGroup, setTargetGroup] = useState('')
  const [internalStakeholder, setInternalStakeholder] = useState('')
  const [isPriority, setIsPriority] = useState(false)
  const [approvedBudget, setApprovedBudget] = useState('')
  const [utilizedBudget, setUtilizedBudget] = useState('')
  const [tierId, setTierId] = useState<string | null>(null)
  const [objectiveId, setObjectiveId] = useState<string | null>(null)
  const [programId, setProgramId] = useState<string | null>(null)
  const [sectorId, setSectorId] = useState<string | null>(null)
  const [newSector, setNewSector] = useState('')
  const [stakeholders, setStakeholders] = useState<string[]>([])
  const [stakeholderDraft, setStakeholderDraft] = useState('')
  const [manualProgress, setManualProgress] = useState('')
  const [atRisk, setAtRisk] = useState(false)
  const [ownerPerson, setOwnerPerson] = useState<ProjectMemberInput>(
    personFromProfile(null),
  )
  const [pm, setPm] = useState<ProjectMemberInput>(personFromProfile(null))
  const [pm2, setPm2] = useState<ProjectMemberInput>(personFromProfile(null))
  const [pmoPartner, setPmoPartner] = useState<ProjectMemberInput>(
    personFromProfile(null),
  )

  function setMeFor(setter: (p: ProjectMemberInput) => void) {
    if (!user) return
    setter({
      user_id: user.id,
      display_name:
        (user.user_metadata?.full_name as string | undefined) ||
        user.email ||
        '',
      email: user.email ?? null,
      role_id: null,
    })
  }

  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (!open) return
    lookupsApi.list('project-statuses').then(setStatuses).catch(() => toast.error('Could not load project statuses.'))
    lookupsApi.list('project-sizes').then(setSizes).catch(() => toast.error('Could not load project sizes.'))
    lookupsApi.list('project-categories').then(setCategories).catch(() => toast.error('Could not load project categories.'))
    lookupsApi.list('tiers').then(setTiers).catch(() => toast.error('Could not load tiers.'))
    lookupsApi.list('strategic-objectives').then(setObjectives).catch(() => toast.error('Could not load strategic objectives.'))
    lookupsApi.list('strategic-programs').then(setPrograms).catch(() => toast.error('Could not load strategic programs.'))
    lookupsApi.list('sectors').then(setSectors).catch(() => toast.error('Could not load sectors.'))
    projectsApi.list().then(setProjects).catch(() => toast.error('Could not load projects.'))
  }, [open])

  // Populate on open / project change — render-phase prev-key pattern.
  const populateKey = open ? project.id : null
  const [prevPopulateKey, setPrevPopulateKey] = useState<string | null>(null)
  if (prevPopulateKey !== populateKey) {
    setPrevPopulateKey(populateKey)
    if (populateKey !== null) {
      setName(project.name)
      setParentId(project.parent_project_id)
      setStatusId(project.status_id)
      setSizeId(project.size_id)
      setAccessControl(project.access_control || 'open')
      setCategoryId(project.category_id)
      setNewCategory('')
      setDescription(project.description ?? '')
      setGoal(project.goal ?? '')
      setTags(project.tags?.join(', ') ?? '')
      setCustomer(project.customer ?? '')
      setPrimaryUrl(project.primary_url ?? '')
      setStartDate(project.start_date ?? '')
      setReferenceId(project.reference_id ?? '')
      setProjectNumber(project.project_number ?? '')
      setPlanYear(project.plan_year != null ? String(project.plan_year) : '')
      setFinanceCode(project.finance_code ?? '')
      setTargetGroup(project.target_group ?? '')
      setInternalStakeholder(project.internal_stakeholder ?? '')
      setIsPriority(project.is_priority ?? false)
      setApprovedBudget(
        project.approved_budget != null ? String(project.approved_budget) : '',
      )
      setUtilizedBudget(
        project.utilized_budget != null ? String(project.utilized_budget) : '',
      )
      setTierId(project.tier_id)
      setObjectiveId(project.strategic_objective_id)
      setProgramId(project.strategic_program_id)
      setSectorId(project.sector_id)
      setNewSector('')
      setStakeholders(project.external_stakeholders ?? [])
      setStakeholderDraft('')
      setManualProgress(
        project.manual_progress != null ? String(project.manual_progress) : '',
      )
      setAtRisk(project.at_risk ?? false)
      setOwnerPerson(personFromProfile(project.owner_id, project.owner))
      setPm(personFromProfile(project.project_manager_id, project.project_manager))
      setPm2(
        personFromProfile(project.project_manager2_id, project.project_manager2),
      )
      setPmoPartner(
        personFromProfile(project.pmo_partner_id, project.pmo_partner),
      )
      setError(null)
      setFieldErrors({})
      setConfirmDelete(false)
    }
  }


  function addStakeholder() {
    const clean = stakeholderDraft.trim()
    if (!clean) return
    setStakeholders((cur) => (cur.includes(clean) ? cur : [...cur, clean]))
    setStakeholderDraft('')
  }

  async function submit() {
    setError(null)
    setFieldErrors({})
    const errs: Record<string, string> = {}
    if (!name.trim()) errs.name = 'A project name is required.'
    if (!statusId) errs.statusId = 'A status is required.'
    if (planYear.trim() && !Number.isInteger(Number(planYear)))
      errs.planYear = 'Plan year must be a whole number.'
    if (
      approvedBudget.trim() &&
      (Number.isNaN(Number(approvedBudget)) || Number(approvedBudget) < 0)
    )
      errs.approvedBudget = 'Enter a valid amount.'
    if (
      utilizedBudget.trim() &&
      (Number.isNaN(Number(utilizedBudget)) || Number(utilizedBudget) < 0)
    )
      errs.utilizedBudget = 'Enter a valid amount.'
    if (
      manualProgress.trim() &&
      (Number.isNaN(Number(manualProgress)) ||
        Number(manualProgress) < 0 ||
        Number(manualProgress) > 100)
    )
      errs.manualProgress = 'Progress must be between 0 and 100.'

    setFieldErrors(errs)
    if (Object.keys(errs).length > 0) return

    setSaving(true)
    try {
      let finalCategoryId = categoryId
      if (categoryId === NEW_CATEGORY) {
        if (!newCategory.trim()) {
          setSaving(false)
          return setError('Enter a name for the new category.')
        }
        const created = await categoriesApi.create(newCategory.trim())
        finalCategoryId = created.id
      }

      let finalSectorId = sectorId
      if (sectorId === NEW_SECTOR) {
        if (!newSector.trim()) {
          setSaving(false)
          return setError('Enter a name for the new sector.')
        }
        const createdSector = await sectorsApi.create(newSector.trim())
        finalSectorId = createdSector.id
      }

      const allStakeholders = [
        ...stakeholders,
        ...(stakeholderDraft.trim() ? [stakeholderDraft.trim()] : []),
      ]

      const tagList = tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)

      await projectsApi.update(project.id, {
        name: name.trim(),
        parent_project_id: parentId,
        status_id: statusId,
        size_id: sizeId,
        category_id: finalCategoryId,
        access_control: accessControl,
        description: description.trim() || null,
        goal: goal.trim() || null,
        customer: customer.trim() || null,
        primary_url: primaryUrl.trim() || null,
        tags: tagList.length ? tagList : null,
        start_date: startDate || null,
        reference_id: referenceId.trim() || null,
        project_number: projectNumber.trim() || null,
        plan_year: planYear.trim() ? Number(planYear) : null,
        finance_code: financeCode.trim() || null,
        target_group: targetGroup.trim() || null,
        internal_stakeholder: internalStakeholder.trim() || null,
        is_priority: isPriority,
        approved_budget: approvedBudget.trim() ? Number(approvedBudget) : null,
        utilized_budget: utilizedBudget.trim() ? Number(utilizedBudget) : null,
        tier_id: tierId,
        strategic_objective_id: objectiveId,
        manual_progress: manualProgress.trim() ? Number(manualProgress) : null,
        at_risk: atRisk,
        strategic_program_id: programId,
        sector_id: finalSectorId === NEW_SECTOR ? null : finalSectorId,
        external_stakeholders: allStakeholders.length ? allStakeholders : null,
        owner_id: ownerPerson.user_id,
        project_manager_id: pm.user_id,
        project_manager2_id: pm2.user_id,
        pmo_partner_id: pmoPartner.user_id,
      })
      onOpenChange(false)
      toast.success('Project updated.')
      onSaved()
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setSaving(false)
    }
  }

  async function doDelete() {
    setError(null)
    setFieldErrors({})
    setDeleting(true)
    try {
      await projectsApi.remove(project.id)
      onOpenChange(false)
      toast.success('Project deleted.')
      onDeleted()
    } catch (e) {
      setError((e as Error).message)
      setConfirmDelete(false)
    } finally {
      setDeleting(false)
    }
  }

  const busy = saving || deleting
  const parentOptions = projects.filter((p) => p.id !== project.id)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Project Details</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label>
              Project Name <span className="text-destructive">*</span>
            </Label>
            <Input value={name} onChange={(e) => setName(e.target.value)}  aria-invalid={fieldErrors.name ? true : undefined} />
            <FieldError message={fieldErrors.name} />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex flex-col gap-2">
              <Label>Reference ID</Label>
              <Input
                value={referenceId}
                placeholder="e.g. 1.1.1"
                onChange={(e) => setReferenceId(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Project Number</Label>
              <Input
                value={projectNumber}
                placeholder="e.g. PRJ-0239"
                onChange={(e) => setProjectNumber(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Plan Year</Label>
              <Input
                type="number"
                value={planYear}
                placeholder="e.g. 26"
                onChange={(e) => setPlanYear(e.target.value)}
                aria-invalid={fieldErrors.planYear ? true : undefined}
              />
              <FieldError message={fieldErrors.planYear} />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Parent Project</Label>
            <Select
              items={[
                { label: '- None -', value: NONE },
                ...parentOptions.map((p) => ({ label: p.name, value: p.id })),
              ]}
              value={parentId ?? NONE}
              onValueChange={(v) => setParentId(v === NONE ? null : v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="- None -" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NONE}>- None -</SelectItem>
                {parentOptions.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label>
                Status <span className="text-destructive">*</span>
              </Label>
              <Select
                items={statuses.map((s) => ({ label: s.name, value: s.id }))}
                value={statusId ?? ''}
                onValueChange={(v) => setStatusId(v ?? null)}
              >
                <SelectTrigger
                  className="w-full"
                  aria-invalid={fieldErrors.statusId ? true : undefined}
                >
                  <SelectValue placeholder="- Select -" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError message={fieldErrors.statusId} />
            </div>

            <div className="flex flex-col gap-2">
              <Label>Project Size</Label>
              <Select
                items={sizes.map((s) => ({ label: s.name, value: s.id }))}
                value={sizeId ?? ''}
                onValueChange={(v) => setSizeId(v ?? null)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="- Select -" />
                </SelectTrigger>
                <SelectContent>
                  {sizes.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label>Strategic Objective</Label>
              <Select
                items={[
                  { label: '- None -', value: NONE },
                  ...objectives.map((o) => ({ label: o.name, value: o.id })),
                ]}
                value={objectiveId ?? NONE}
                onValueChange={(v) => {
                  setObjectiveId(v === NONE ? null : v)
                  setProgramId(null)
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="- None -" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NONE}>- None -</SelectItem>
                  {objectives.map((o) => (
                    <SelectItem key={o.id} value={o.id}>
                      {o.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Tier</Label>
              <Select
                items={[
                  { label: '- None -', value: NONE },
                  ...tiers.map((t) => ({ label: t.name, value: t.id })),
                ]}
                value={tierId ?? NONE}
                onValueChange={(v) => setTierId(v === NONE ? null : v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="- None -" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NONE}>- None -</SelectItem>
                  {tiers.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label>Strategic Program</Label>
              <Select
                items={[
                  { label: '- None -', value: NONE },
                  ...programs
                    .filter((pr) => pr.objective_id === objectiveId)
                    .map((pr) => ({ label: pr.name, value: pr.id })),
                ]}
                value={programId ?? NONE}
                onValueChange={(v) => setProgramId(v === NONE ? null : v)}
              >
                <SelectTrigger className="w-full" disabled={!objectiveId}>
                  <SelectValue
                    placeholder={
                      objectiveId ? '- None -' : 'Pick an objective first'
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NONE}>- None -</SelectItem>
                  {programs
                    .filter((pr) => pr.objective_id === objectiveId)
                    .map((pr) => (
                      <SelectItem key={pr.id} value={pr.id}>
                        {pr.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Sector</Label>
              <Select
                items={[
                  { label: '- None -', value: NONE },
                  ...sectors.map((sec) => ({ label: sec.name, value: sec.id })),
                  { label: '- New Sector -', value: NEW_SECTOR },
                ]}
                value={sectorId ?? NONE}
                onValueChange={(v) => setSectorId(v === NONE ? null : v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="- None -" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NONE}>- None -</SelectItem>
                  {sectors.map((sec) => (
                    <SelectItem key={sec.id} value={sec.id}>
                      {sec.name}
                    </SelectItem>
                  ))}
                  <SelectItem value={NEW_SECTOR}>- New Sector -</SelectItem>
                </SelectContent>
              </Select>
              {sectorId === NEW_SECTOR && (
                <Input
                  value={newSector}
                  placeholder="New Sector Name"
                  onChange={(e) => setNewSector(e.target.value)}
                />
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label>Approved Budget (AED)</Label>
              <Input
                type="number"
                min={0}
                value={approvedBudget}
                onChange={(e) => setApprovedBudget(e.target.value)}
                aria-invalid={fieldErrors.approvedBudget ? true : undefined}
              />
              <FieldError message={fieldErrors.approvedBudget} />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Utilized Budget (AED)</Label>
              <Input
                type="number"
                min={0}
                value={utilizedBudget}
                onChange={(e) => setUtilizedBudget(e.target.value)}
                aria-invalid={fieldErrors.utilizedBudget ? true : undefined}
              />
              <FieldError message={fieldErrors.utilizedBudget} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label>Manual Progress (%)</Label>
              <Input
                type="number"
                min={0}
                max={100}
                value={manualProgress}
                onChange={(e) => setManualProgress(e.target.value)}
                aria-invalid={fieldErrors.manualProgress ? true : undefined}
              />
              <FieldError message={fieldErrors.manualProgress} />
            </div>
            <div className="flex flex-col gap-2">
              <Label>At Risk</Label>
              <button
                type="button"
                onClick={() => setAtRisk((v) => !v)}
                aria-pressed={atRisk}
                className="flex w-fit cursor-pointer items-center gap-2 rounded-md border border-input px-3 py-2 text-sm transition-colors hover:bg-accent"
              >
                <TriangleAlert
                  className={
                    atRisk
                      ? 'h-4 w-4 text-destructive'
                      : 'h-4 w-4 text-muted-foreground'
                  }
                />
                {atRisk ? 'Flagged at risk' : 'Not at risk'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label>Finance Code</Label>
              <Input
                value={financeCode}
                onChange={(e) => setFinanceCode(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Internal Stakeholder</Label>
              <Input
                value={internalStakeholder}
                onChange={(e) => setInternalStakeholder(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Target Group</Label>
            <Input
              value={targetGroup}
              placeholder="Who this project serves"
              onChange={(e) => setTargetGroup(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>External Stakeholders</Label>
            {stakeholders.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {stakeholders.map((sh) => (
                  <span
                    key={sh}
                    className="hint-in inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground"
                  >
                    {sh}
                    <button
                      type="button"
                      aria-label={`Remove ${sh}`}
                      onClick={() =>
                        setStakeholders((cur) => cur.filter((x) => x !== sh))
                      }
                      className="rounded-full p-0.5 transition-colors hover:bg-accent"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
            <Input
              value={stakeholderDraft}
              placeholder="Type a name and press Enter"
              onChange={(e) => setStakeholderDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ',') {
                  e.preventDefault()
                  addStakeholder()
                }
              }}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label>Project Manager</Label>
            <div className="flex items-start gap-2">
              <div className="flex-1">
                <PersonAutocomplete allowPending={false} value={pm} onChange={(p) => setPm((cur) => ({ ...cur, ...p }))} />
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setMeFor(setPm)}
              >
                Me
              </Button>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label>Project Manager 2</Label>
            <div className="flex items-start gap-2">
              <div className="flex-1">
                <PersonAutocomplete allowPending={false} value={pm2} onChange={(p) => setPm2((cur) => ({ ...cur, ...p }))} />
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setMeFor(setPm2)}
              >
                Me
              </Button>
            </div>
          </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label>Project Owner</Label>
            <div className="flex items-start gap-2">
              <div className="flex-1">
                <PersonAutocomplete allowPending={false} value={ownerPerson} onChange={(p) => setOwnerPerson((cur) => ({ ...cur, ...p }))} />
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setMeFor(setOwnerPerson)}
              >
                Me
              </Button>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label>PMO Partner</Label>
            <div className="flex items-start gap-2">
              <div className="flex-1">
                <PersonAutocomplete allowPending={false} value={pmoPartner} onChange={(p) => setPmoPartner((cur) => ({ ...cur, ...p }))} />
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setMeFor(setPmoPartner)}
              >
                Me
              </Button>
            </div>
          </div>
          </div>

          <button
            type="button"
            onClick={() => setIsPriority((p) => !p)}
            aria-pressed={isPriority}
            className="flex w-fit cursor-pointer items-center gap-2 rounded-md border border-input px-3 py-2 text-sm transition-colors hover:bg-accent"
          >
            <Star
              className={
                isPriority
                  ? 'h-4 w-4 fill-gold text-gold'
                  : 'h-4 w-4 text-muted-foreground'
              }
            />
            {isPriority ? 'Priority project' : 'Not a priority project'}
          </button>

          <div className="flex flex-col gap-2">
            <Label>
              Access Control <span className="text-destructive">*</span>
            </Label>
            <div className="flex flex-col gap-2">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  name="access-control"
                  className="h-4 w-4 accent-primary"
                  checked={accessControl === 'open'}
                  onChange={() => setAccessControl('open')}
                />
                <span className="text-sm">Open</span>
              </label>
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  name="access-control"
                  className="h-4 w-4 accent-primary"
                  checked={accessControl === 'restricted'}
                  onChange={() => setAccessControl('restricted')}
                />
                <span className="text-sm font-medium">
                  Restricted – Only Accessible by Associated People
                </span>
              </label>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Category</Label>
            <Select
              items={[
                ...categories.map((c) => ({ label: c.name, value: c.id })),
                { label: '- New Category -', value: NEW_CATEGORY },
              ]}
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
                <SelectItem value={NEW_CATEGORY}>- New Category -</SelectItem>
              </SelectContent>
            </Select>
            {categoryId === NEW_CATEGORY && (
              <Input
                value={newCategory}
                placeholder="New Category Name"
                onChange={(e) => setNewCategory(e.target.value)}
              />
            )}
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
            <Label>Goal</Label>
            <Textarea
              rows={3}
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
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

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label>Customer</Label>
              <Input
                value={customer}
                onChange={(e) => setCustomer(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Primary URL</Label>
              <Input
                value={primaryUrl}
                onChange={(e) => setPrimaryUrl(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:w-1/2">
            <Label>Project Start Date</Label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          {error && <p className="hint-in text-sm font-medium text-destructive">{error}</p>}
        </div>

        <DialogFooter className="sm:justify-between">
          <div>
            {confirmDelete ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-destructive">
                  Delete?
                </span>
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
            )}
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={busy}
            >
              Cancel
            </Button>
            <Button onClick={submit} disabled={busy}>
            {saving && <Loader2 className="animate-spin" />}
              {saving ? 'Saving…' : 'Apply Changes'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}