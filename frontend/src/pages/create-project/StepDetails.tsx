import { toast } from '@/lib/toast'
import { useEffect, useState } from 'react'
import type { CreateProjectForm } from '../CreateProjectWizard'
import { lookupsApi, type Lookup } from '@/lib/api'
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

  useEffect(() => {
    lookupsApi.list('project-statuses').then(setStatuses).catch(() => toast.error('Could not load project statuses.'))
    lookupsApi.list('project-sizes').then(setSizes).catch(() => toast.error('Could not load project sizes.'))
  }, [])

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
    </div>
  )
}