import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { StepProject } from './create-project/StepProject'
import { StepAccess } from './create-project/StepAccess'

export interface ProjectMemberInput {
  user_id: string | null // set when linked to an existing user; null = pending
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
        role_id: null, // set to Project Manager once roles load
      },
      emptyMember(),
      emptyMember(),
    ],
  }))
  const [errors, setErrors] = useState<Record<string, string>>({})

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

  function next() {
    if (step === 0 && !validateStep1()) return
    if (step === 1 && !validateStep2()) return
    setErrors({})
    setStep((s) => Math.min(s + 1, STEP_LABELS.length - 1))
  }

  function back() {
    setErrors({})
    setStep((s) => Math.max(s - 1, 0))
  }

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
      {step >= 2 && (
        <div className="rounded-md border border-dashed p-8 text-center text-muted-foreground">
          "{STEP_LABELS[step]}" step — we'll build this next.
        </div>
      )}

      <div className="mt-8 flex items-center justify-between">
        <Button variant="outline" onClick={() => navigate('/')}>
          Cancel
        </Button>
        <div className="flex gap-2">
          {step > 0 && (
            <Button variant="outline" onClick={back}>
              Back
            </Button>
          )}
          <Button onClick={next} disabled={step === STEP_LABELS.length - 1}>
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}