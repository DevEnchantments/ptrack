import { toast } from '@/lib/toast'
import { Star } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { CreateProjectForm } from '../CreateProjectWizard'
import { lookupsApi, type Lookup } from '@/lib/api'
import { NEW_SECTOR } from '@/lib/project-form'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { CategorySelect } from '@/components/CategorySelect'
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

export function StepDetails({ form, errors, update }: Props) {
  const [statuses, setStatuses] = useState<Lookup[]>([])
  const [sizes, setSizes] = useState<Lookup[]>([])
  const [tiers, setTiers] = useState<Lookup[]>([])
  const [sectors, setSectors] = useState<Lookup[]>([])
  const [objectives, setObjectives] = useState<Lookup[]>([])

  useEffect(() => {
    lookupsApi.list('project-statuses').then(setStatuses).catch(() => toast.error('Could not load project statuses.'))
    lookupsApi.list('project-sizes').then(setSizes).catch(() => toast.error('Could not load project sizes.'))
    lookupsApi.list('tiers').then(setTiers).catch(() => toast.error('Could not load tiers.'))
    lookupsApi.list('sectors').then(setSectors).catch(() => toast.error('Could not load sectors.'))
    lookupsApi.list('strategic-objectives').then(setObjectives).catch(() => toast.error('Could not load strategic objectives.'))
  }, [])

  const NONE = '__none__'

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label>
            Status <span className="text-destructive">*</span>
          </Label>
          <Select
            items={statuses.map((s) => ({ label: s.name, value: s.id }))}
            value={form.status_id ?? undefined}
            onValueChange={(v) => update({ status_id: v })}
          >
            <SelectTrigger className="w-full">
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
          {errors.status_id && (
            <p className="text-sm text-destructive">{errors.status_id}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label>Category</Label>
          <CategorySelect
            value={form.category_id}
            onChange={(id) => update({ category_id: id })}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:max-w-[calc(50%-0.75rem)]">
        <Label>Project Size</Label>
        <Select
          items={sizes.map((s) => ({ label: s.name, value: s.id }))}
          value={form.size_id ?? undefined}
          onValueChange={(v) => update({ size_id: v })}
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

      <div className="flex flex-col gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          rows={4}
          value={form.description}
          onChange={(e) => update({ description: e.target.value })}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="goal">Goal</Label>
        <Textarea
          id="goal"
          rows={3}
          value={form.goal}
          onChange={(e) => update({ goal: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="customer">Customer</Label>
          <Input
            id="customer"
            value={form.customer}
            onChange={(e) => update({ customer: e.target.value })}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="tags">Tags</Label>
          <Input
            id="tags"
            value={form.tags}
            placeholder="Enter tags separated by commas"
            onChange={(e) => update({ tags: e.target.value })}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="primary_url">Primary URL</Label>
        <Input
          id="primary_url"
          value={form.primary_url}
          onChange={(e) => update({ primary_url: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="flex flex-col gap-2">
          <Label htmlFor="reference_id">
            Reference ID <span className="text-destructive">*</span>
          </Label>
          <Input
            id="reference_id"
            value={form.reference_id}
            placeholder="e.g. 1.1.1"
            onChange={(e) => update({ reference_id: e.target.value })}
            aria-invalid={errors.reference_id ? true : undefined}
          />
          {errors.reference_id && (
            <p className="text-sm text-destructive">{errors.reference_id}</p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="project_number">Project Number</Label>
          <Input
            id="project_number"
            value={form.project_number}
            placeholder="e.g. PRJ-0239"
            onChange={(e) => update({ project_number: e.target.value })}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="plan_year">
            Plan Year <span className="text-destructive">*</span>
          </Label>
          <Input
            id="plan_year"
            type="number"
            value={form.plan_year}
            placeholder="e.g. 26"
            onChange={(e) => update({ plan_year: e.target.value })}
            aria-invalid={errors.plan_year ? true : undefined}
          />
          {errors.plan_year && (
            <p className="text-sm text-destructive">{errors.plan_year}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label>Strategic Objective</Label>
          <Select
            items={[
              { label: '- None -', value: NONE },
              ...objectives.map((o) => ({ label: o.name, value: o.id })),
            ]}
            value={form.strategic_objective_id ?? NONE}
            onValueChange={(v) =>
              update({ strategic_objective_id: v === NONE ? null : v })
            }
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
            value={form.tier_id ?? NONE}
            onValueChange={(v) => update({ tier_id: v === NONE ? null : v })}
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

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="approved_budget">
            Approved Budget (AED){' '}
            <span className="text-destructive">*</span>
          </Label>
          <Input
            id="approved_budget"
            type="number"
            min={0}
            value={form.approved_budget}
            onChange={(e) => update({ approved_budget: e.target.value })}
            aria-invalid={errors.approved_budget ? true : undefined}
          />
          {errors.approved_budget && (
            <p className="text-sm text-destructive">{errors.approved_budget}</p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="utilized_budget">Utilized Budget (AED)</Label>
          <Input
            id="utilized_budget"
            type="number"
            min={0}
            value={form.utilized_budget}
            onChange={(e) => update({ utilized_budget: e.target.value })}
            aria-invalid={errors.utilized_budget ? true : undefined}
          />
          {errors.utilized_budget && (
            <p className="text-sm text-destructive">{errors.utilized_budget}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="finance_code">Finance Code</Label>
          <Input
            id="finance_code"
            value={form.finance_code}
            onChange={(e) => update({ finance_code: e.target.value })}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="internal_stakeholder">Internal Stakeholder</Label>
          <Input
            id="internal_stakeholder"
            value={form.internal_stakeholder}
            onChange={(e) => update({ internal_stakeholder: e.target.value })}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:max-w-[calc(50%-0.75rem)]">
        <Label>
          Sector <span className="text-destructive">*</span>
        </Label>
        <Select
          items={[
            ...sectors.map((sec) => ({ label: sec.name, value: sec.id })),
            { label: '- New Sector -', value: NEW_SECTOR },
          ]}
          value={form.sector_id ?? undefined}
          onValueChange={(v) => update({ sector_id: v ?? null })}
        >
          <SelectTrigger
            className="w-full"
            aria-invalid={errors.sector_id ? true : undefined}
          >
            <SelectValue placeholder="- Select -" />
          </SelectTrigger>
          <SelectContent>
            {sectors.map((sec) => (
              <SelectItem key={sec.id} value={sec.id}>
                {sec.name}
              </SelectItem>
            ))}
            <SelectItem value={NEW_SECTOR}>- New Sector -</SelectItem>
          </SelectContent>
        </Select>
        {form.sector_id === NEW_SECTOR && (
          <Input
            value={form.new_sector}
            placeholder="New Sector Name"
            onChange={(e) => update({ new_sector: e.target.value })}
          />
        )}
        {errors.sector_id && (
          <p className="text-sm text-destructive">{errors.sector_id}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="target_group">Target Group</Label>
        <Input
          id="target_group"
          value={form.target_group}
          placeholder="Who this project serves"
          onChange={(e) => update({ target_group: e.target.value })}
        />
      </div>

      <button
        type="button"
        onClick={() => update({ is_priority: !form.is_priority })}
        aria-pressed={form.is_priority}
        className="flex w-fit cursor-pointer items-center gap-2 rounded-md border border-input px-3 py-2 text-sm transition-colors hover:bg-accent"
      >
        <Star
          className={
            form.is_priority
              ? 'h-4 w-4 fill-gold text-gold'
              : 'h-4 w-4 text-muted-foreground'
          }
        />
        {form.is_priority ? 'Priority project' : 'Not a priority project'}
      </button>
    </div>
  )
}