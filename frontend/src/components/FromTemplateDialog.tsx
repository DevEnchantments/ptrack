import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LayoutTemplate, Loader2, X } from 'lucide-react'
import { templatesApi, type ProjectTemplate } from '@/lib/api'
import { toast } from '@/lib/toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
}

/** Create a project from a saved template: pick, name, date, go. Milestone
 *  and outcome dates shift relative to the chosen start date. */
export function FromTemplateDialog({ open, onOpenChange }: Props) {
  const navigate = useNavigate()
  const [templates, setTemplates] = useState<ProjectTemplate[]>([])
  const [loaded, setLoaded] = useState(false)
  const [selected, setSelected] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    templatesApi
      .list()
      .then((t) => {
        setTemplates(t)
        setLoaded(true)
      })
      .catch((e) => {
        setError((e as Error).message)
        setLoaded(true)
      })
  }, [open])

  const [prevOpen, setPrevOpen] = useState(open)
  if (prevOpen !== open) {
    setPrevOpen(open)
    if (open) {
      setLoaded(false)
      setSelected(null)
      setName('')
      setStartDate('')
      setEndDate('')
      setError(null)
    }
  }

  async function removeTemplate(t: ProjectTemplate) {
    try {
      await templatesApi.remove(t.id)
      setTemplates((cur) => cur.filter((x) => x.id !== t.id))
      if (selected === t.id) setSelected(null)
      toast.success('Template deleted.')
    } catch (e) {
      toast.error((e as Error).message)
    }
  }

  async function create() {
    if (!selected) return
    const clean = name.trim()
    if (!clean) {
      setError('A project name is required.')
      return
    }
    setCreating(true)
    setError(null)
    try {
      const result = await templatesApi.instantiate(selected, {
        name: clean,
        start_date: startDate || undefined,
        target_end_date: endDate || undefined,
      })
      onOpenChange(false)
      toast.success(`"${result.name}" created from template.`)
      navigate(`/projects/${result.project_id}`)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setCreating(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>New Project from Template</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          {!loaded ? (
            <div className="h-24 animate-pulse rounded-md border bg-muted/40" />
          ) : templates.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No templates yet. Open a project and use "Save as Template"
              first.
            </p>
          ) : (
            <ul className="flex max-h-56 flex-col gap-1.5 overflow-y-auto">
              {templates.map((t) => (
                <li key={t.id} className="group relative">
                  <button
                    type="button"
                    onClick={() => setSelected(t.id)}
                    className={`flex w-full cursor-pointer items-start gap-2.5 rounded-md border px-3 py-2 text-left transition-colors ${
                      selected === t.id
                        ? 'border-primary bg-primary/5'
                        : 'hover:bg-muted/50'
                    }`}
                  >
                    <LayoutTemplate className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">
                        {t.name}
                      </span>
                      <span className="block text-xs text-muted-foreground">
                        {t.outcome_count} outcome
                        {t.outcome_count === 1 ? '' : 's'} ·{' '}
                        {t.milestone_count} milestone
                        {t.milestone_count === 1 ? '' : 's'}
                        {t.description ? ` · ${t.description}` : ''}
                      </span>
                    </span>
                  </button>
                  <button
                    type="button"
                    aria-label={`Delete template ${t.name}`}
                    onClick={() => void removeTemplate(t)}
                    className="absolute right-2 top-2 hidden cursor-pointer rounded p-1 text-muted-foreground hover:text-destructive group-hover:block"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          )}

          {selected && (
            <>
              <div className="flex flex-col gap-2">
                <Label>
                  New Project Name <span className="text-destructive">*</span>
                </Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label>Start Date</Label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Target End Date</Label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Milestone dates shift relative to the start date; leave it
                empty to create the plan without dates.
              </p>
            </>
          )}

          {error && (
            <p className="hint-in text-sm font-medium text-destructive">
              {error}
            </p>
          )}
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={creating}
          >
            Cancel
          </Button>
          <Button onClick={create} disabled={creating || !selected}>
            {creating && <Loader2 className="animate-spin" />}
            {creating ? 'Creating…' : 'Create Project'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
