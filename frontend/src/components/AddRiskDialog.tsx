import { FieldError } from '@/components/FieldError'
import { Loader2 } from 'lucide-react'
import { personName } from '@/lib/format'
import { toast } from '@/lib/toast'
import { useEffect, useState } from 'react'
import type { ProjectMemberInput } from '@/pages/CreateProjectWizard'
import { lookupsApi, risksApi, type Lookup, type Risk } from '@/lib/api'
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

const STATEMENT_MAX = 200
const ACTION_MAX = 200

function emptyPerson(): ProjectMemberInput {
  return { user_id: null, display_name: '', email: null, role_id: null }
}

interface Props {
  projectId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdded: () => void
  existing?: Risk | null
}

/** FDD Fig 6 risk modal. Score (probability x impact) is deliberately absent
 *  until the formula is signed off (docs/FORMULAS.md rule). */
export function AddRiskDialog({
  projectId,
  open,
  onOpenChange,
  onAdded,
  existing,
}: Props) {
  const isEdit = Boolean(existing)
  const { user } = useAuth()

  const [sources, setSources] = useState<Lookup[]>([])
  const [categories, setCategories] = useState<Lookup[]>([])
  const [probabilities, setProbabilities] = useState<Lookup[]>([])
  const [impacts, setImpacts] = useState<Lookup[]>([])
  const [responses, setResponses] = useState<Lookup[]>([])

  const [statement, setStatement] = useState('')
  const [identifiedBy, setIdentifiedBy] = useState('')
  const [dateIdentified, setDateIdentified] = useState('')
  const [sourceId, setSourceId] = useState<string | null>(null)
  const [categoryId, setCategoryId] = useState<string | null>(null)
  const [owner, setOwner] = useState<ProjectMemberInput>(emptyPerson())
  const [probabilityId, setProbabilityId] = useState<string | null>(null)
  const [impactId, setImpactId] = useState<string | null>(null)
  const [responseId, setResponseId] = useState<string | null>(null)
  const [responsePlan, setResponsePlan] = useState('')
  const [priority, setPriority] = useState('')
  const [action, setAction] = useState('')
  const [status, setStatus] = useState<'open' | 'closed'>('open')
  const [type, setType] = useState<'risk' | 'issue'>('risk')

  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const busy = saving || deleting

  useEffect(() => {
    if (!open) return
    lookupsApi.list('risk-sources').then(setSources).catch(() => toast.error('Could not load risk sources.'))
    lookupsApi.list('risk-categories').then(setCategories).catch(() => toast.error('Could not load risk categories.'))
    lookupsApi.list('risk-probability-levels').then(setProbabilities).catch(() => toast.error('Could not load probability levels.'))
    lookupsApi.list('risk-impact-levels').then(setImpacts).catch(() => toast.error('Could not load impact levels.'))
    lookupsApi.list('risk-responses').then(setResponses).catch(() => toast.error('Could not load risk responses.'))
  }, [open])

  function reset() {
    setStatement('')
    setIdentifiedBy('')
    setDateIdentified('')
    setSourceId(null)
    setCategoryId(null)
    setOwner(emptyPerson())
    setProbabilityId(null)
    setImpactId(null)
    setResponseId(null)
    setResponsePlan('')
    setPriority('')
    setAction('')
    setStatus('open')
    setType('risk')
    setError(null)
    setFieldErrors({})
  }

  // Populate on open / record change — render-phase prev-key pattern.
  const populateKey = open ? (existing?.id ?? '__new__') : null
  const [prevPopulateKey, setPrevPopulateKey] = useState<string | null>(null)
  if (prevPopulateKey !== populateKey) {
    setPrevPopulateKey(populateKey)
    if (populateKey !== null) {
      if (existing) {
        setStatement(existing.statement)
        setIdentifiedBy(existing.identified_by ?? '')
        setDateIdentified(existing.date_identified ?? '')
        setSourceId(existing.source_id)
        setCategoryId(existing.category_id)
        setOwner(
          existing.owner_id
            ? {
                user_id: existing.owner_id,
                display_name: personName(existing.owner, ''),
                email: existing.owner?.email ?? null,
                role_id: null,
              }
            : emptyPerson(),
        )
        setProbabilityId(existing.probability_id)
        setImpactId(existing.impact_id)
        setResponseId(existing.response_id)
        setResponsePlan(existing.response_plan ?? '')
        setPriority(existing.priority ?? '')
        setAction(existing.action ?? '')
        setStatus(existing.status === 'closed' ? 'closed' : 'open')
        setType(existing.type === 'issue' ? 'issue' : 'risk')
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
    if (!statement.trim()) errs.statement = 'A risk statement is required.'
    if (statement.trim().length > STATEMENT_MAX)
      errs.statement = `Statements are capped at ${STATEMENT_MAX} characters.`
    if (action.trim().length > ACTION_MAX)
      errs.action = `Actions are capped at ${ACTION_MAX} characters.`

    setFieldErrors(errs)
    if (Object.keys(errs).length > 0) return

    setSaving(true)
    try {
      const payload = {
        statement: statement.trim(),
        identified_by: identifiedBy.trim() || null,
        date_identified: dateIdentified || null,
        source_id: sourceId,
        category_id: categoryId,
        owner_id: owner.user_id,
        probability_id: probabilityId,
        impact_id: impactId,
        response_id: responseId,
        response_plan: responsePlan.trim() || null,
        priority: priority.trim() || null,
        action: action.trim() || null,
        status,
        type,
      }

      if (isEdit && existing) {
        await risksApi.update(projectId, existing.id, payload)
      } else {
        await risksApi.add(projectId, payload)
      }
      reset()
      onOpenChange(false)
      toast.success(isEdit ? 'Risk updated.' : 'Risk added.')
      onAdded()
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
      await risksApi.remove(projectId, existing.id)
      reset()
      onOpenChange(false)
      toast.success('Risk deleted.')
      onAdded()
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

  function radioRow<T extends string>(
    label: string,
    name: string,
    options: Array<{ label: string; value: T }>,
    value: T,
    onChange: (v: T) => void,
  ) {
    return (
      <div className="flex flex-col gap-2">
        <Label>{label}</Label>
        <div className="flex items-center gap-6 pt-1">
          {options.map((o) => (
            <label
              key={o.value}
              className="flex cursor-pointer items-center gap-2"
            >
              <input
                type="radio"
                name={name}
                className="h-4 w-4 accent-primary"
                checked={value === o.value}
                onChange={() => onChange(o.value)}
              />
              <span className="text-sm font-medium">{o.label}</span>
            </label>
          ))}
        </div>
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
          <DialogTitle>Risk</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-4">
              <Label>
                Risk Statement <span className="text-destructive">*</span>
              </Label>
              <span className="text-xs text-muted-foreground">
                {statement.trim().length}/{STATEMENT_MAX}
              </span>
            </div>
            <Textarea
              rows={2}
              value={statement}
              onChange={(e) => setStatement(e.target.value)}
              aria-invalid={fieldErrors.statement ? true : undefined}
            />
            <FieldError message={fieldErrors.statement} />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {radioRow(
              'Type',
              'risk-type',
              [
                { label: 'Risk', value: 'risk' as const },
                { label: 'Issue', value: 'issue' as const },
              ],
              type,
              setType,
            )}
            {radioRow(
              'Status',
              'risk-status',
              [
                { label: 'Open', value: 'open' as const },
                { label: 'Closed', value: 'closed' as const },
              ],
              status,
              setStatus,
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label>Identified By</Label>
              <Input
                value={identifiedBy}
                onChange={(e) => setIdentifiedBy(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Date Identified</Label>
              <Input
                type="date"
                value={dateIdentified}
                onChange={(e) => setDateIdentified(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {lookupSelect('Source', sources, sourceId, setSourceId)}
            {lookupSelect('Category', categories, categoryId, setCategoryId)}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {lookupSelect(
              'Probability',
              probabilities,
              probabilityId,
              setProbabilityId,
            )}
            {lookupSelect('Impact', impacts, impactId, setImpactId)}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {lookupSelect('Response', responses, responseId, setResponseId)}
            <div className="flex flex-col gap-2">
              <Label>Priority</Label>
              <Input
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Risk Owner</Label>
            <div className="flex items-start gap-2">
              <div className="flex-1">
                <PersonAutocomplete
                  value={owner}
                  onChange={(p) => setOwner((cur) => ({ ...cur, ...p }))}
                />
              </div>
              <Button type="button" variant="outline" size="sm" onClick={setMe}>
                Me
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Response Plan</Label>
            <Textarea
              rows={3}
              value={responsePlan}
              onChange={(e) => setResponsePlan(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-4">
              <Label>Action</Label>
              <span className="text-xs text-muted-foreground">
                {action.trim().length}/{ACTION_MAX}
              </span>
            </div>
            <Textarea
              rows={2}
              value={action}
              onChange={(e) => setAction(e.target.value)}
              aria-invalid={fieldErrors.action ? true : undefined}
            />
            <FieldError message={fieldErrors.action} />
          </div>

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
                  : 'Add Risk'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
