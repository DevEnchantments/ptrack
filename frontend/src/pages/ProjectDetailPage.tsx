import { useCallback, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { projectsApi, type ProjectDetail, type ProjectMemberDetail } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { AddPersonDialog } from '@/components/AddPersonDialog'

const ACTIONS = [
  'Add Person', 'Add Issue', 'Add Resource', 'Add Milestone',
  'Add Action Item', 'Add Link', 'Attach File', 'Add Update',
  'Add Status Report',
]

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  if (value === null || value === undefined || value === '') return null
  return (
    <div className="grid grid-cols-3 gap-4 border-b px-1 py-3 last:border-0">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="col-span-2 text-sm">{value}</dd>
    </div>
  )
}

function memberName(m: ProjectMemberDetail) {
  return m.profile?.full_name || m.profile?.email || m.pending_name || 'Unknown'
}

export function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [project, setProject] = useState<ProjectDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [addPersonOpen, setAddPersonOpen] = useState(false)

  const load = useCallback(() => {
    if (!id) return
    projectsApi
      .get(id)
      .then(setProject)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    load()
  }, [load])

  if (loading) {
    return <div className="p-6 text-muted-foreground">Loading…</div>
  }
  if (error || !project) {
    return (
      <div className="p-6">
        <p className="text-destructive">{error ?? 'Project not found.'}</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate('/')}>
          Back to projects
        </Button>
      </div>
    )
  }

  const accessLabel =
    project.access_control === 'restricted'
      ? 'Restricted – Only Accessible by Associated People'
      : 'Open'

  const primaryUrlValue = project.primary_url ? (
    <a href={project.primary_url} target="_blank" rel="noreferrer" className="text-primary hover:underline">{project.primary_url}</a>
  ) : null

  return (
    <div className="min-h-svh">
      <header className="border-b px-6 py-4">
        <button
          onClick={() => navigate('/')}
          className="text-sm text-muted-foreground hover:underline"
        >
          Projects
        </button>
        <span className="mx-2 text-muted-foreground">/</span>
        <span className="text-sm">{project.name}</span>
      </header>

      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 p-6 lg:grid-cols-[1fr_260px]">
        <div>
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-semibold">{project.name}</h1>
            <Button variant="outline" size="sm" disabled>
              Edit Project
            </Button>
          </div>

          <dl className="rounded-md border px-4">
            <Field label="Category" value={project.category?.name ?? null} />
            <Field label="Status" value={project.status?.name ?? null} />
            <Field label="Access Control" value={accessLabel} />
            <Field label="Description" value={project.description} />
            <Field label="Goal" value={project.goal} />
            <Field label="Customer" value={project.customer} />
            <Field label="Project Start Date" value={project.start_date} />
            <Field label="Project Size" value={project.size?.name ?? null} />
            <Field
              label="Tags"
              value={project.tags?.length ? project.tags.join(', ') : null}
            />
            <Field label="Primary URL" value={primaryUrlValue} />
            <Field
              label="Created"
              value={new Date(project.created_at).toLocaleDateString()}
            />
            <Field
              label="Last Updated"
              value={new Date(project.updated_at).toLocaleDateString()}
            />
          </dl>

          <h2 className="mb-3 mt-8 text-lg font-semibold">People</h2>
          {project.members.length === 0 ? (
            <p className="text-sm text-muted-foreground">No people assigned.</p>
          ) : (
            <ul className="divide-y rounded-md border">
              {project.members.map((m) => (
                <li
                  key={m.id}
                  className="flex items-center justify-between px-4 py-3"
                >
                  <div>
                    <span className="text-sm font-medium">{memberName(m)}</span>
                    {m.status === 'pending' && (
                      <span className="ml-2 text-xs text-amber-600">(pending)</span>
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {m.role?.name ?? '—'}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <aside>
          <div className="rounded-md border p-2">
            {ACTIONS.map((a) => {
              const enabled = a === 'Add Person'
              return (
                <button
                  key={a}
                  disabled={!enabled}
                  onClick={enabled ? () => setAddPersonOpen(true) : undefined}
                  title={enabled ? '' : 'Coming in a later step'}
                  className={
                    'w-full rounded px-3 py-2 text-left text-sm ' +
                    (enabled
                      ? 'hover:bg-accent'
                      : 'text-muted-foreground disabled:cursor-not-allowed')
                  }
                >
                  {a}
                </button>
              )
            })}
          </div>
        </aside>
      </div>

      <AddPersonDialog
        projectId={project.id}
        open={addPersonOpen}
        onOpenChange={setAddPersonOpen}
        onAdded={load}
      />
    </div>
  )
}