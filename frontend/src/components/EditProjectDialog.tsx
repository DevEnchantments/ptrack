import { FieldError } from '@/components/FieldError'
import { Loader2, Star } from 'lucide-react'
import { toast } from '@/lib/toast'
import { useEffect, useState } from 'react'
import {
  projectsApi,
  lookupsApi,
  categoriesApi,
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
const NEW_CATEGORY = '__new_category__'

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
  const [statuses, setStatuses] = useState<Lookup[]>([])
  const [sizes, setSizes] = useState<Lookup[]>([])
  const [categories, setCategories] = useState<Lookup[]>([])
  const [tiers, setTiers] = useState<Lookup[]>([])
  const [objectives, setObjectives] = useState<Lookup[]>([])
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
      setError(null)
      setFieldErrors({})
      setConfirmDelete(false)
    }
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
                onValueChange={(v) => setObjectiveId(v === NONE ? null : v)}
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