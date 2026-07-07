import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/lib/auth-context'
import { projectsApi } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { StepProject } from './create-project/StepProject'
import { StepAccess } from './create-project/StepAccess'
import { StepDetails } from './create-project/StepDetails'
import { StepConfirmation } from './create-project/StepConfirmation'

export interface ProjectMemberInput {
  user_id: string | null
  display_name: string
  email: string | null
  role_id: string | null
}

export interface CreateProjectForm {
  name: string
  parent_project_id: string | null
  start_date: string
  access_control: 'open' | 'restricted'
  members: ProjectMemberInput[]
  status_id: string | null
  category_id: string | null
  size_id: string | null
  description: string
  goal: string
  customer: string
  tags: string
  primary_url: string
}

const STEP_LABELS = ['Project', 'Access', 'Details', 'Confirmation']

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

export function emptyMember(): ProjectMemberInput {
  return { user_id: null, display_name: '', email: null, role_id: null }
}

export function CreateProjectWizard() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<CreateProjectForm>(() => ({
    name: '',
    parent_project_id: null,
    start_date: todayISO(),
    access_control: 'open',
    members: [
      {
        user_id: user?.id ?? null,
        display_name: user?.email ?? '',
        email: user?.email ?? null,
        role_id: null,
      },
      emptyMember(),
      emptyMember(),
    ],
    status_id: null,
    category_id: null,
    size_id: null,
    description: '',
    goal: '',
    customer: '',
    tags: '',
    primary_url: '',
  }))
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  function update(patch: Partial<CreateProjectForm>) {
    setForm((f) => ({ ...f, ...patch }))
  }

  function validateStep1() {
    const e: Record<string, string> = {}
    if (!form.name.trim()) e.name = 'Project name is required.'
    if (!form.start_date) e.start_date = 'Start date is required.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function validateStep2() {
    const e: Record<string, string> = {}
    const first = form.members[0]
    if (!first || !first.display_name.trim() || !first.role_id) {
      e.members = 'The first member needs both a person and a role.'
    }
    form.members.forEach((m, i) => {
      if (i === 0) return
      const hasPerson = m.display_name.trim().length > 0
      const hasRole = !!m.role_id
      if (hasPerson !== hasRole) {
        e.members = 'Each added member needs both a person and a role.'
      }
    })
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function validateStep3() {
    const e: Record<string, string> = {}
    if (!form.status_id) e.status_id = 'Status is required.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function next() {
    if (step === 0 && !validateStep1()) return
    if (step === 1 && !validateStep2()) return
    if (step === 2 && !validateStep3()) return
    setErrors({})
    setStep((s) => Math.min(s + 1, STEP_LABELS.length - 1))
  }

  function back() {
    setErrors({})
    setStep((s) => Math.max(s - 1, 0))
  }

  function buildPayload() {
    const members = form.members
      .filter((m) => m.display_name.trim() && m.role_id)
      .map((m) => ({
        user_id: m.user_id ?? null,
        pending_name: m.user_id ? null : m.display_name.trim(),
        role_id: m.role_id,
      }))
    const tags = form.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
    return {
      name: form.name.trim(),
      parent_project_id: form.parent_project_id ?? undefined,
      start_date: form.start_date || undefined,
      access_control: form.access_control,
      status_id: form.status_id ?? undefined,
      category_id: form.category_id ?? undefined,
      size_id: form.size_id ?? undefined,
      description: form.description.trim() || undefined,
      goal: form.goal.trim() || undefined,
      customer: form.customer.trim() || undefined,
      tags: tags.length ? tags : undefined,
      primary_url: form.primary_url.trim() || undefined,
      members,
    }
  }

  async function submit() {
    setSubmitError(null)
    setSubmitting(true)
    try {
      await projectsApi.create(buildPayload())
      navigate('/')
    } catch (e) {
      setSubmitError((e as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  const isLast = step === STEP_LABELS.length - 1

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="mb-6 text-2xl font-semibold">Create a Project</h1>

      <ol className="mb-8 flex items-center gap-2">
        {STEP_LABELS.map((label, i) => (
          <li key={label} className="flex items-center gap-2">
            <span
              className={
                'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-medium ' +
                (i <= step
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground')
              }
            >
              {i + 1}
            </span>
            <span
              className={
                'text-sm ' +
                (i === step ? 'font-medium' : 'text-muted-foreground')
              }
            >
              {label}
            </span>
          </li>
        ))}
      </ol>

      {step === 0 && <StepProject form={form} errors={errors} update={update} />}
      {step === 1 && <StepAccess form={form} errors={errors} update={update} />}
      {step === 2 && <StepDetails form={form} errors={errors} update={update} />}
      {step === 3 && <StepConfirmation form={form} />}

      {submitError && (
        <p className="mt-4 text-sm text-destructive">{submitError}</p>
      )}

      <div className="mt-8 flex items-center justify-between">
        <Button variant="outline" onClick={() => navigate('/')}>
          Cancel
        </Button>
        <div className="flex gap-2">
          {step > 0 && (
            <Button variant="outline" onClick={back} disabled={submitting}>
              Back
            </Button>
          )}
          {isLast ? (
            <Button onClick={submit} disabled={submitting}>
              {submitting ? 'Creating…' : 'Create Project'}
            </Button>
          ) : (
            <Button onClick={next}>Next</Button>
          )}
        </div>
      </div>
    </div>
  )
}