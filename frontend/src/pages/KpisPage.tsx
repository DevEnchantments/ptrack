import { useCallback, useEffect, useState } from 'react'
import {
  ChevronDown,
  ChevronRight,
  Loader2,
  Minus,
  Plus,
  Star,
  Trash2,
  TrendingDown,
  TrendingUp,
} from 'lucide-react'
import { kpisApi, type Kpi, type KpiReading } from '@/lib/api'
import { usePageTitle } from '@/lib/use-page-title'
import { kpiAchievement, kpiDataQuality } from '@/lib/formulas'
import { toast } from '@/lib/toast'
import { AddKpiDialog } from '@/components/AddKpiDialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

function formatValue(kpi: Kpi, value: number | null | undefined): string {
  if (value === null || value === undefined) return '—'
  const text = value.toFixed(Math.min(4, Math.max(0, kpi.decimal_places)))
  return kpi.unit === '%' ? `${text}%` : kpi.unit ? `${text} ${kpi.unit}` : text
}

function sortedReadings(kpi: Kpi): KpiReading[] {
  return [...(kpi.readings ?? [])].sort((a, b) =>
    b.reading_date.localeCompare(a.reading_date),
  )
}

/** Polarity-aware movement between the two most recent readings. This is
 *  display only — achievement % awaits formula sign-off (docs/FORMULAS.md). */
function Trend({ kpi }: { kpi: Kpi }) {
  const readings = sortedReadings(kpi)
  if (readings.length < 2)
    return <Minus className="h-4 w-4 text-muted-foreground" aria-hidden />
  const [latest, previous] = readings
  if (latest.value === previous.value)
    return <Minus className="h-4 w-4 text-muted-foreground" aria-hidden />
  const rising = latest.value > previous.value
  const good = kpi.polarity === 'lower_is_better' ? !rising : rising
  const Icon = rising ? TrendingUp : TrendingDown
  return (
    <Icon
      className={`h-4 w-4 ${good ? 'text-[var(--status-green-fg)]' : 'text-destructive'}`}
      aria-label={
        rising
          ? good
            ? 'Rising (improving)'
            : 'Rising (worsening)'
          : good
            ? 'Falling (improving)'
            : 'Falling (worsening)'
      }
    />
  )
}

function ReadingForm({ kpi, onSaved }: { kpi: Kpi; onSaved: () => void }) {
  const [date, setDate] = useState('')
  const [value, setValue] = useState('')
  const [analysis, setAnalysis] = useState('')
  const [saving, setSaving] = useState(false)

  async function save() {
    if (!date || !value.trim() || Number.isNaN(Number(value))) {
      toast.error('A reading needs a date and a numeric value.')
      return
    }
    setSaving(true)
    try {
      await kpisApi.addReading(kpi.id, {
        reading_date: date,
        value: Number(value),
        performance_analysis: analysis.trim() || null,
      })
      setDate('')
      setValue('')
      setAnalysis('')
      toast.success('Reading recorded.')
      onSaved()
    } catch (e) {
      toast.error((e as Error).message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-wrap items-end gap-2">
      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium text-muted-foreground">Date</span>
        <Input
          type="date"
          className="h-8 w-40"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium text-muted-foreground">Value</span>
        <Input
          inputMode="decimal"
          className="h-8 w-28"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
      <div className="min-w-48 flex-1">
        <span className="text-xs font-medium text-muted-foreground">
          Performance analysis (optional)
        </span>
        <Textarea
          rows={1}
          className="min-h-8"
          value={analysis}
          onChange={(e) => setAnalysis(e.target.value)}
        />
      </div>
      <Button size="sm" onClick={save} disabled={saving}>
        {saving ? <Loader2 className="animate-spin" /> : <Plus />}
        Add Reading
      </Button>
    </div>
  )
}

function PlanForm({ kpi, onSaved }: { kpi: Kpi; onSaved: () => void }) {
  const [description, setDescription] = useState('')
  const [owner, setOwner] = useState('')
  const [due, setDue] = useState('')
  const [saving, setSaving] = useState(false)

  async function save() {
    if (!description.trim()) {
      toast.error('An action plan needs a description.')
      return
    }
    setSaving(true)
    try {
      await kpisApi.addPlan(kpi.id, {
        description: description.trim(),
        owner: owner.trim() || null,
        due_date: due || null,
      })
      setDescription('')
      setOwner('')
      setDue('')
      toast.success('Action plan added.')
      onSaved()
    } catch (e) {
      toast.error((e as Error).message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-wrap items-end gap-2">
      <div className="min-w-56 flex-1">
        <span className="text-xs font-medium text-muted-foreground">
          Action plan
        </span>
        <Input
          className="h-8"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium text-muted-foreground">Owner</span>
        <Input
          className="h-8 w-36"
          value={owner}
          onChange={(e) => setOwner(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium text-muted-foreground">Due</span>
        <Input
          type="date"
          className="h-8 w-40"
          value={due}
          onChange={(e) => setDue(e.target.value)}
        />
      </div>
      <Button size="sm" onClick={save} disabled={saving}>
        {saving ? <Loader2 className="animate-spin" /> : <Plus />}
        Add Plan
      </Button>
    </div>
  )
}

function KpiDetail({ kpi, onChanged }: { kpi: Kpi; onChanged: () => void }) {
  const readings = sortedReadings(kpi)
  const plans = [...(kpi.action_plans ?? [])].sort((a, b) =>
    (a.due_date ?? '9999').localeCompare(b.due_date ?? '9999'),
  )

  async function removeReading(readingId: string) {
    try {
      await kpisApi.removeReading(kpi.id, readingId)
      toast.success('Reading removed.')
      onChanged()
    } catch (e) {
      toast.error((e as Error).message)
    }
  }

  async function togglePlan(planId: string, status: string) {
    try {
      await kpisApi.updatePlan(kpi.id, planId, {
        status: status === 'done' ? 'open' : 'done',
      })
      onChanged()
    } catch (e) {
      toast.error((e as Error).message)
    }
  }

  async function removePlan(planId: string) {
    try {
      await kpisApi.removePlan(kpi.id, planId)
      toast.success('Action plan removed.')
      onChanged()
    } catch (e) {
      toast.error((e as Error).message)
    }
  }

  const meta: Array<[string, string | null]> = [
    ['Pillar', kpi.pillar],
    ['Entity', kpi.entity],
    ['Tier', kpi.tier?.name ?? null],
    ['Strategic Objective', kpi.objective?.name ?? null],
    ['Owner', kpi.owner?.full_name || kpi.owner?.email || null],
    ['Data Source', kpi.data_source],
    ['Calculation Method', kpi.calculation_method],
    ['Rationale', kpi.rationale],
  ]

  return (
    <div className="flex flex-col gap-5 border-t bg-muted/30 px-4 py-4">
      {kpi.description && (
        <p className="text-sm text-muted-foreground">{kpi.description}</p>
      )}

      <dl className="grid grid-cols-1 gap-x-8 gap-y-2 text-sm sm:grid-cols-2">
        {meta
          .filter(([, v]) => v)
          .map(([label, v]) => (
            <div key={label} className="flex gap-2">
              <dt className="w-40 shrink-0 font-medium text-muted-foreground">
                {label}
              </dt>
              <dd>{v}</dd>
            </div>
          ))}
      </dl>

      <section className="flex flex-col gap-2">
        <h3 className="text-sm font-semibold">Readings</h3>
        {readings.length === 0 ? (
          <p className="text-sm text-muted-foreground">No readings yet.</p>
        ) : (
          <ul className="flex flex-col divide-y rounded-md border bg-card">
            {readings.map((r) => (
              <li key={r.id} className="flex items-start gap-3 px-3 py-2">
                <span className="w-28 shrink-0 text-sm tabular-nums text-muted-foreground">
                  {r.reading_date}
                </span>
                <span className="w-28 shrink-0 text-sm font-semibold tabular-nums">
                  {formatValue(kpi, r.value)}
                </span>
                <span className="flex-1 text-sm text-muted-foreground">
                  {r.performance_analysis}
                </span>
                <button
                  type="button"
                  className="cursor-pointer text-muted-foreground transition-colors hover:text-destructive"
                  aria-label="Remove reading"
                  onClick={() => void removeReading(r.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
        <ReadingForm kpi={kpi} onSaved={onChanged} />
      </section>

      <section className="flex flex-col gap-2">
        <h3 className="text-sm font-semibold">Action Plans</h3>
        {plans.length === 0 ? (
          <p className="text-sm text-muted-foreground">No action plans.</p>
        ) : (
          <ul className="flex flex-col divide-y rounded-md border bg-card">
            {plans.map((p) => (
              <li key={p.id} className="flex items-start gap-3 px-3 py-2">
                <input
                  type="checkbox"
                  className="mt-0.5 h-4 w-4 cursor-pointer accent-primary"
                  checked={p.status === 'done'}
                  onChange={() => void togglePlan(p.id, p.status)}
                  aria-label={
                    p.status === 'done' ? 'Reopen plan' : 'Mark plan done'
                  }
                />
                <span
                  className={`flex-1 text-sm ${p.status === 'done' ? 'text-muted-foreground line-through' : ''}`}
                >
                  {p.description}
                  {p.owner && (
                    <span className="text-muted-foreground"> · {p.owner}</span>
                  )}
                </span>
                {p.due_date && (
                  <span className="shrink-0 text-sm tabular-nums text-muted-foreground">
                    {p.due_date}
                  </span>
                )}
                <button
                  type="button"
                  className="cursor-pointer text-muted-foreground transition-colors hover:text-destructive"
                  aria-label="Remove action plan"
                  onClick={() => void removePlan(p.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
        <PlanForm kpi={kpi} onSaved={onChanged} />
      </section>
    </div>
  )
}

/** FDD 1.8 KPI registry (Figs 27-29): definitions, readings, action plans.
 *  Achievement % and the data-quality index are deliberately not computed —
 *  those formulas await sign-off (docs/FORMULAS.md). */
export function KpisPage() {
  usePageTitle('KPIs')

  const [kpis, setKpis] = useState<Kpi[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Kpi | null>(null)

  const load = useCallback(() => {
    kpisApi
      .list()
      .then((rows) => {
        setKpis(rows)
        setError(null)
      })
      .catch((e) => setError((e as Error).message))
      .finally(() => setLoading(false))
  }, [])

  useEffect(load, [load])

  function toggle(id: string) {
    setExpanded((cur) => {
      const next = new Set(cur)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="mx-auto max-w-5xl p-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Reporting
          </p>
          <h1 className="text-2xl font-semibold">KPIs</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Entity-level key performance indicators with their readings and
            action plans.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditing(null)
            setDialogOpen(true)
          }}
        >
          <Plus />
          Add KPI
        </Button>
      </div>

      {loading ? (
        <div className="mt-6 flex flex-col gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-14 animate-pulse rounded-lg border bg-card"
            />
          ))}
        </div>
      ) : error ? (
        <p className="mt-6 text-sm font-medium text-destructive">
          Could not load KPIs: {error}. If this is a fresh setup, the
          `fdd_kpis.sql` migration may not have been run yet.
        </p>
      ) : kpis.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">
          No KPIs defined yet. Add the first one to start tracking.
        </p>
      ) : (
        <ul className="mt-6 flex flex-col gap-2">
          {kpis.map((kpi) => {
            const isOpen = expanded.has(kpi.id)
            const latest = sortedReadings(kpi)[0] ?? null
            const openPlans = (kpi.action_plans ?? []).filter(
              (p) => p.status !== 'done',
            ).length
            // F6/F7 (FORMULAS.md, decided 2026-08-18)
            const achievement = kpiAchievement(kpi, kpi.readings ?? [])
            const quality = kpiDataQuality(kpi, kpi.readings ?? [])
            const achievementTone =
              achievement === null
                ? ''
                : achievement >= 100
                  ? 'border-[var(--status-green-border)] bg-[var(--status-green-bg)] text-[var(--status-green-fg)]'
                  : achievement >= 70
                    ? 'border-[var(--status-amber-border)] bg-[var(--status-amber-bg)] text-[var(--status-amber-fg)]'
                    : 'border-[var(--status-red-border)] bg-[var(--status-red-bg)] text-[var(--status-red-fg)]'
            return (
              <li
                key={kpi.id}
                className="overflow-hidden rounded-lg border bg-card shadow-xs"
              >
                <div className="flex items-center gap-3 px-4 py-3">
                  <button
                    type="button"
                    className="cursor-pointer text-muted-foreground"
                    aria-expanded={isOpen}
                    aria-label={isOpen ? 'Collapse KPI' : 'Expand KPI'}
                    onClick={() => toggle(kpi.id)}
                  >
                    {isOpen ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    type="button"
                    className="flex min-w-0 flex-1 cursor-pointer items-center gap-2 text-left"
                    onClick={() => toggle(kpi.id)}
                  >
                    {kpi.is_priority && (
                      <Star
                        className="h-4 w-4 shrink-0 fill-[var(--gold)] text-[var(--gold)]"
                        aria-label="Priority KPI"
                      />
                    )}
                    <span className="truncate font-medium">{kpi.name}</span>
                    <span className="hidden shrink-0 text-xs capitalize text-muted-foreground sm:inline">
                      {kpi.frequency}
                    </span>
                  </button>
                  {achievement !== null && (
                    <span
                      title="Achievement vs target (F6)"
                      className={`hidden shrink-0 rounded-full border px-2 py-0.5 text-xs font-medium tabular-nums md:inline ${achievementTone}`}
                    >
                      {achievement}%
                    </span>
                  )}
                  {quality !== null && (
                    <span
                      title="Data-quality index: timeliness, completeness, reliability (F7)"
                      className="hidden shrink-0 rounded-full bg-muted px-2 py-0.5 text-xs tabular-nums text-muted-foreground lg:inline"
                    >
                      DQ {quality}
                    </span>
                  )}
                  <Trend kpi={kpi} />
                  <div className="w-40 shrink-0 text-right text-sm tabular-nums">
                    <span className="font-semibold">
                      {formatValue(kpi, latest?.value ?? null)}
                    </span>
                    <span className="text-muted-foreground">
                      {' '}
                      / {formatValue(kpi, kpi.target)}
                    </span>
                  </div>
                  {openPlans > 0 && (
                    <span className="hidden shrink-0 rounded-full border border-[var(--status-amber-border)] bg-[var(--status-amber-bg)] px-2 py-0.5 text-xs font-medium text-[var(--status-amber-fg)] sm:inline">
                      {openPlans} plan{openPlans === 1 ? '' : 's'}
                    </span>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditing(kpi)
                      setDialogOpen(true)
                    }}
                  >
                    Edit
                  </Button>
                </div>
                {isOpen && <KpiDetail kpi={kpi} onChanged={load} />}
              </li>
            )
          })}
        </ul>
      )}

      <p className="mt-4 text-xs text-muted-foreground">
        Latest reading shown against target. Achievement % and the data-quality
        index arrive once their formulas are signed off.
      </p>

      <AddKpiDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSaved={load}
        existing={editing}
      />
    </div>
  )
}
