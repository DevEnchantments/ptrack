import { FieldError } from '@/components/FieldError'
import { Loader2 } from 'lucide-react'
import { toast } from '@/lib/toast'
import { useEffect, useState } from 'react'
import type { ProjectMemberInput } from '@/pages/CreateProjectWizard'
import {
  kpisApi,
  lookupsApi,
  projectsApi,
  type Kpi,
  type Lookup,
} from '@/lib/api'
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

const NAME_MAX = 255

const FREQUENCIES = [
  { label: 'Monthly', value: 'monthly' },
  { label: 'Quarterly', value: 'quarterly' },
  { label: 'Annual', value: 'annual' },
]

function emptyPerson(): ProjectMemberInput {
  return { user_id: null, display_name: '', email: null, role_id: null }
}

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSaved: () => void
  existing?: Kpi | null
}

/** FDD Fig 27 KPI definition modal. Achievement % and the data-quality index
 *  are deliberately absent until their formulas are signed off
 *  (docs/FORMULAS.md rule). */
export function AddKpiDialog({ open, onOpenChange, onSaved, existing }: Props) {
  const isEdit = Boolean(existing)
  const { user } = useAuth()

  const [tiers, setTiers] = useState<Lookup[]>([])
  const [objectives, setObjectives] = useState<Lookup[]>([])

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [pillar, setPillar] = useState('')
  const [entity, setEntity] = useState('')
  const [unit, setUnit] = useState('')
  const [polarity, setPolarity] = useState<
    'higher_is_better' | 'lower_is_better'
  >('higher_is_better')
  const [decimalPlaces, setDecimalPlaces] = useState('0')
  const [dataSource, setDataSource] = useState('')
  const [calculationMethod, setCalculationMethod] = useState('')
  const [frequency, setFrequency] = useState('monthly')
  const [rationale, setRationale] = useState('')
  const [baseline, setBaseline] = useState('')
  const [target, setTarget] = useState('')
  const [isPriority, setIsPriority] = useState(false)
  const [tierId, setTierId] = useState<string | null>(null)
  const [projectId, setProjectId] = useState<string | null>(null)
  const [projects, setProjects] = useState<Lookup[]>([])
  const [objectiveId, setObjectiveId] = useState<string | null>(null)
  const [owner, setOwner] = useState<ProjectMemberInput>(emptyPerson())

  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const busy = saving || deleting

  useEffect(() => {
    if (!open) return
    lookupsApi
      .list('tiers')
      .then(setTiers)
      .catch(() => toast.error('Could not load tiers.'))
    lookupsApi
      .list('strategic-objectives')
      .then(setObjectives)
      .catch(() => toast.error('Could not load strategic objectives.'))
  }, [open])

  function reset() {
    setName('')
    setDescription('')
    setPillar('')
    setEntity('')
    setUnit('')
    setPolarity('higher_is_better')
    setDecimalPlaces('0')
    setDataSource('')
    setCalculationMethod('')
    setFrequency('monthly')
    setRationale('')
    setBaseline('')
    setTarget('')
    setIsPriority(false)
    setTierId(null)
    setProjectId(null)
    setObjectiveId(null)
    setOwner(emptyPerson())
    setError(null)
    setFieldErrors({})
  }

  // Populate on open / record change — render-phase prev-key pattern.
  useEffect(() => {
    if (!open) return
    projectsApi
      .list()
      .then((rows) => setProjects(rows.map((p) => ({ id: p.id, name: p.name }))))
      .catch(() => setProjects([]))
  }, [open])

  const populateKey = open ? (existing?.id ?? '__new__') : null
  const [prevPopulateKey, setPrevPopulateKey] = useState<string | null>(null)
  if (prevPopulateKey !== populateKey) {
    setPrevPopulateKey(populateKey)
    if (populateKey !== null) {
      if (existing) {
        setName(existing.name)
        setDescription(existing.description ?? '')
        setPillar(existing.pillar ?? '')
        setEntity(existing.entity ?? '')
        setUnit(existing.unit ?? '')
        setPolarity(
          existing.polarity === 'lower_is_better'
            ? 'lower_is_better'
            : 'higher_is_better',
        )
        setDecimalPlaces(String(existing.decimal_places ?? 0))
        setDataSource(existing.data_source ?? '')
        setCalculationMethod(existing.calculation_method ?? '')
        setFrequency(existing.frequency || 'monthly')
        setRationale(existing.rationale ?? '')
        setBaseline(existing.baseline === null ? '' : String(existing.baseline))
        setTarget(existing.target === null ? '' : String(existing.target))
        setIsPriority(existing.is_priority)
        setTierId(existing.tier_id)
        setObjectiveId(existing.objective_id)
        setProjectId(existing.project_id)
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
      } else {
        reset()
      }
      setError(null)
      setFieldErrors({})
    }
  }

  function setMe() {
    if (!user) return
    const fullName =
      (user.user_metadata?.full_name as string | undefined) || user.email || ''
    setOwner({
      user_id: user.id,
      display_name: fullName,
      email: user.email ?? null,
      role_id: null,
    })
  }

  async function submit() {
    setError(null)
    setFieldErrors({})
    const errs: Record<string, string> = {}
    if (!name.trim()) errs.name = 'A KPI name is required.'
    if (name.trim().length > NAME_MAX)
      errs.name = `Names are capped at ${NAME_MAX} characters.`
    const decimals = Number(decimalPlaces)
    if (!Number.isInteger(decimals) || decimals < 0 || decimals > 4)
      errs.decimal_places = 'Decimal places must be a whole number from 0 to 4.'
    if (baseline.trim() && Number.isNaN(Number(baseline)))
      errs.baseline = 'Baseline must be a number.'
    if (target.trim() && Number.isNaN(Number(target)))
      errs.target = 'Target must be a number.'

    setFieldErrors(errs)
    if (Object.keys(errs).length > 0) return

    setSaving(true)
    try {
      const payload = {
        name: name.trim(),
        description: description.trim() || null,
        pillar: pillar.trim() || null,
        entity: entity.trim() || null,
        unit: unit.trim() || null,
        polarity,
        decimal_places: decimals,
        data_source: dataSource.trim() || null,
        calculation_method: calculationMethod.trim() || null,
        frequency,
        rationale: rationale.trim() || null,
        baseline: baseline.trim() ? Number(baseline) : null,
        target: target.trim() ? Number(target) : null,
        is_priority: isPriority,
        tier_id: tierId,
        objective_id: objectiveId,
        owner_id: owner.user_id,
        project_id: projectId,
      }

      if (isEdit && existing) {
        await kpisApi.update(existing.id, payload)
      } else {
        await kpisApi.add(payload)
      }
      reset()
      onOpenChange(false)
      toast.success(isEdit ? 'KPI updated.' : 'KPI added.')
      onSaved()
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setSaving(false)
    }
  }

  async function remove() {
    if (!existing) return
    setError(null)
    setFieldErrors({})
    setDeleting(true)
    try {
      await kpisApi.remove(existing.id)
      reset()
      onOpenChange(false)
      toast.success('KPI deleted.')
      onSaved()
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setDeleting(false)
    }
  }

  function lookupSelect(
    label: string,
    items: Lookup[],
    value: string | null,
    onChange: (v: string | null) => void,
  ) {
    return (
      <div className="flex flex-col gap-2">
        <Label>{label}</Label>
        <Select
          items={items.map((l) => ({ label: l.name, value: l.id }))}
          value={value ?? ''}
          onValueChange={(v) => onChange(v ?? null)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="- Select -" />
          </SelectTrigger>
          <SelectContent>
            {items.map((l) => (
              <SelectItem key={l.id} value={l.id}>
                {l.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    )
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
          <DialogTitle>KPI</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-4">
              <Label>
                Name <span className="text-destructive">*</span>
              </Label>
              <span className="text-xs text-muted-foreground">
                {name.trim().length}/{NAME_MAX}
              </span>
            </div>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              aria-invalid={fieldErrors.name ? true : undefined}
            />
            <FieldError message={fieldErrors.name} />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Description</Label>
            <Textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label>Pillar</Label>
              <Input
                value={pillar}
                onChange={(e) => setPillar(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Entity</Label>
              <Input
                value={entity}
                onChange={(e) => setEntity(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {lookupSelect('Tier', tiers, tierId, setTierId)}
            {lookupSelect(
              'Strategic Objective',
              objectives,
              objectiveId,
              setObjectiveId,
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {lookupSelect(
              'Linked Project (optional)',
              projects,
              projectId,
              setProjectId,
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex flex-col gap-2">
              <Label>Unit</Label>
              <Input
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="%, days, count…"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Decimal Places</Label>
              <Input
                type="number"
                min={0}
                max={4}
                value={decimalPlaces}
                onChange={(e) => setDecimalPlaces(e.target.value)}
                aria-invalid={fieldErrors.decimal_places ? true : undefined}
              />
              <FieldError message={fieldErrors.decimal_places} />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Frequency</Label>
              <Select
                items={FREQUENCIES}
                value={frequency}
                onValueChange={(v) => setFrequency(v || 'monthly')}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FREQUENCIES.map((f) => (
                    <SelectItem key={f.value} value={f.value}>
                      {f.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Direction</Label>
            <div className="flex items-center gap-6 pt-1">
              {(
                [
                  { label: 'Higher is better', value: 'higher_is_better' },
                  { label: 'Lower is better', value: 'lower_is_better' },
                ] as const
              ).map((o) => (
                <label
                  key={o.value}
                  className="flex cursor-pointer items-center gap-2"
                >
                  <input
                    type="radio"
                    name="kpi-polarity"
                    className="h-4 w-4 accent-primary"
                    checked={polarity === o.value}
                    onChange={() => setPolarity(o.value)}
                  />
                  <span className="text-sm font-medium">{o.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label>Baseline</Label>
              <Input
                inputMode="decimal"
                value={baseline}
                onChange={(e) => setBaseline(e.target.value)}
                aria-invalid={fieldErrors.baseline ? true : undefined}
              />
              <FieldError message={fieldErrors.baseline} />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Target</Label>
              <Input
                inputMode="decimal"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                aria-invalid={fieldErrors.target ? true : undefined}
              />
              <FieldError message={fieldErrors.target} />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label>KPI Owner</Label>
            <div className="flex items-start gap-2">
              <div className="flex-1">
                <PersonAutocomplete
                  value={owner}
                  onChange={(p) => setOwner((cur) => ({ ...cur, ...p }))}
                  allowPending={false}
                />
              </div>
              <Button type="button" variant="outline" size="sm" onClick={setMe}>
                Me
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Data Source</Label>
            <Input
              value={dataSource}
              onChange={(e) => setDataSource(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Calculation Method</Label>
            <Textarea
              rows={2}
              value={calculationMethod}
              onChange={(e) => setCalculationMethod(e.target.value)}
              placeholder="Described in words; automated computation awaits formula sign-off."
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Rationale</Label>
            <Textarea
              rows={2}
              value={rationale}
              onChange={(e) => setRationale(e.target.value)}
            />
          </div>

          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              className="h-4 w-4 accent-primary"
              checked={isPriority}
              onChange={(e) => setIsPriority(e.target.checked)}
            />
            <span className="text-sm font-medium">Priority KPI</span>
          </label>

          {error && (
            <p className="hint-in text-sm font-medium text-destructive">
              {error}
            </p>
          )}
        </div>

        <DialogFooter className="sm:justify-between">
          <div>
            {isEdit && (
              <ConfirmDeleteButton
                onConfirm={remove}
                deleting={deleting}
                disabled={saving}
                resetKey={open}
              />
            )}
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
              {saving && <Loader2 className="animate-spin" />}
              {saving
                ? isEdit
                  ? 'Saving…'
                  : 'Adding…'
                : isEdit
                  ? 'Apply Changes'
                  : 'Add KPI'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
