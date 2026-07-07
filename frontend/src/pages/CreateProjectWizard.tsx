import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { StepProject } from './create-project/StepProject'

export interface CreateProjectForm {
  name: string
  parent_project_id: string | null
  start_date: string
}

const STEP_LABELS = ['Project', 'Access', 'Details', 'Confirmation']

function todayISO() {
  return new Date().toISOString().slice(0, 10) // yyyy-mm-dd
}

export function CreateProjectWizard() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<CreateProjectForm>({
    name: '',
    parent_project_id: null,
    start_date: todayISO(),
  })
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

  function next() {
    if (step === 0 && !validateStep1()) return
    setStep((s) => Math.min(s + 1, STEP_LABELS.length - 1))
  }

  function back() {
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

      {step === 0 ? (
        <StepProject form={form} errors={errors} update={update} />
      ) : (
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