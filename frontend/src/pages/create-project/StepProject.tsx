import { useEffect, useState } from 'react'
import type { CreateProjectForm } from '../CreateProjectWizard'
import { projectsApi, type Project } from '@/lib/api'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const NO_PARENT = 'none'

interface Props {
  form: CreateProjectForm
  errors: Record<string, string>
  update: (patch: Partial<CreateProjectForm>) => void
}

export function StepProject({ form, errors, update }: Props) {
  const [projects, setProjects] = useState<Project[]>([])
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    projectsApi
      .list()
      .then(setProjects)
      .catch((e: Error) => setLoadError(e.message))
  }, [])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">
          Project Name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="name"
          value={form.name}
          onChange={(e) => update({ name: e.target.value })}
          placeholder="Enter a project name"
        />
        {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="parent">Parent Project</Label>
        <Select
          value={form.parent_project_id ?? NO_PARENT}
          onValueChange={(v) =>
            update({ parent_project_id: v === NO_PARENT ? null : v })
          }
        >
          <SelectTrigger id="parent" className="w-full">
            <SelectValue placeholder="Optionally identify a parent project" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={NO_PARENT}>No Parent</SelectItem>
            {projects.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {loadError && (
          <p className="text-sm text-destructive">
            Couldn't load projects: {loadError}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="start_date">
          Start Date <span className="text-destructive">*</span>
        </Label>
        <Input
          id="start_date"
          type="date"
          value={form.start_date}
          onChange={(e) => update({ start_date: e.target.value })}
        />
        {errors.start_date && (
          <p className="text-sm text-destructive">{errors.start_date}</p>
        )}
      </div>
    </div>
  )
}