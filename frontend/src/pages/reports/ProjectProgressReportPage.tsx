import { Printer } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  projectsApi,
  type ProjectDetail,
  type ProjectSections,
} from '@/lib/api'
import {
  calculatedProgress,
  plannedProgress,
  riskScore,
} from '@/lib/formulas'
import { usePageTitle } from '@/lib/use-page-title'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { StatusPill } from '@/components/StatusPill'
import { Chip } from '@/components/WorkflowPanel'

const MILESTONE_LABELS: Record<string, string> = {
  open: 'Open',
  closed_completed: 'Closed / Completed',
  not_applicable: 'Not Applicable',
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  if (value === null || value === undefined || value === '') return null
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium">{value}</dd>
    </div>
  )
}

/** Per-project printable progress report (FDD section 5). */
export function ProjectProgressReportPage() {
  usePageTitle('Project Progress Report')
  const { projectId } = useParams<{ projectId: string }>()
  const navigate = useNavigate()
  const [project, setProject] = useState<ProjectDetail | null>(null)
  const [sections, setSections] = useState<ProjectSections | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!projectId) return
    Promise.all([projectsApi.get(projectId), projectsApi.sections(projectId)])
      .then(([p, s]) => {
        setProject(p)
        setSections(s)
      })
      .catch((e: Error) => setError(e.message))
  }, [projectId])

  if (error) {
    return (
      <div className="p-6">
        <p className="text-destructive">{error}</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => navigate(`/projects/${projectId}`)}
        >
          Back to project
        </Button>
      </div>
    )
  }

  if (!project || !sections) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <Skeleton className="h-8 w-72" />
        <Skeleton className="mt-4 h-96 w-full rounded-md" />
      </div>
    )
  }

  const milestones = sections.milestones
  const calc = calculatedProgress(milestones)
  const planned = plannedProgress(project.start_date, project.target_end_date)
  const openRisks = sections.risks.filter((r) => r.status === 'open')
  const openIssues = sections.issues.filter((i) => i.status === 'open')
  const today = new Date().toISOString().slice(0, 10)
  const currentSubmission = sections.submissions.find(
    (s) =>
      s.cycle && s.cycle.period_start <= today && today <= s.cycle.period_end,
  )
  const outcomeName = (id: string | null) =>
    sections.outcomes.find((o) => o.id === id)?.name ?? '-'

  return (
    <div className="animate-step-in mx-auto max-w-4xl p-6 print:max-w-none print:p-0">
      <div className="mb-6 flex items-center justify-between gap-3 print:hidden">
        <button
          onClick={() => navigate(`/projects/${project.id}`)}
          className="text-sm text-muted-foreground hover:underline"
        >
          Back to {project.name}
        </button>
        <Button variant="outline" size="sm" onClick={() => window.print()}>
          <Printer className="h-4 w-4" />
          Print
        </Button>
      </div>

      <div className="overflow-hidden rounded-md border print:rounded-none print:border-0">
        <div className="bg-brand px-6 py-4">
          <span className="text-sm font-semibold tracking-wide text-brand-foreground">
            P-TRACK
          </span>
        </div>

        <div className="px-6 py-5">
          <h1 className="text-2xl font-semibold">{project.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Project Progress Report · generated{' '}
            {new Date().toISOString().slice(0, 10)}
          </p>

          <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3">
            <Field label="Reference ID" value={project.reference_id} />
            <Field label="Status" value={project.status?.name} />
            <Field label="Sector" value={project.sector?.name} />
            <Field label="Tier" value={project.tier?.name} />
            <Field
              label="Owner"
              value={project.owner?.full_name ?? project.owner?.email}
            />
            <Field
              label="Project Manager"
              value={
                project.project_manager?.full_name ??
                project.project_manager?.email
              }
            />
            <Field label="Sponsor" value={project.sponsor} />
            <Field label="Start Date" value={project.start_date} />
            <Field label="Target End Date" value={project.target_end_date} />
            <Field
              label="Approved Budget"
              value={
                project.approved_budget != null
                  ? `AED ${Number(project.approved_budget).toLocaleString()}`
                  : null
              }
            />
            <Field
              label="Utilized Budget"
              value={
                project.utilized_budget != null
                  ? `AED ${Number(project.utilized_budget).toLocaleString()}`
                  : null
              }
            />
            <Field
              label="Cycle Status"
              value={
                currentSubmission ? (
                  <Chip status={currentSubmission.status} />
                ) : (
                  <Chip status="not_submitted" />
                )
              }
            />
          </dl>

          <div className="mt-5 grid grid-cols-3 gap-4 rounded-md border p-4">
            <div>
              <p className="text-xs text-muted-foreground">Manual Progress</p>
              <p className="text-xl font-semibold">
                {project.manual_progress != null
                  ? `${project.manual_progress}%`
                  : '-'}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">
                Calculated Progress
              </p>
              <p className="text-xl font-semibold">
                {calc != null ? `${calc}%` : '-'}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Planned Progress</p>
              <p className="text-xl font-semibold">
                {planned != null ? `${planned}%` : '-'}
              </p>
            </div>
          </div>

          <h2 className="mt-6 text-lg font-semibold">Milestones</h2>
          {milestones.length === 0 ? (
            <p className="mt-2 text-sm text-muted-foreground">
              No milestones recorded.
            </p>
          ) : (
            <table className="mt-2 w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs text-muted-foreground">
                  <th className="py-2 pr-3 font-medium">Milestone</th>
                  <th className="py-2 pr-3 font-medium">Outcome</th>
                  <th className="py-2 pr-3 font-medium">Due</th>
                  <th className="py-2 pr-3 text-right font-medium">Weight</th>
                  <th className="py-2 pr-3 text-right font-medium">%</th>
                  <th className="py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {milestones.map((m) => (
                  <tr key={m.id}>
                    <td className="py-2 pr-3 font-medium">{m.name}</td>
                    <td className="py-2 pr-3">{outcomeName(m.outcome_id)}</td>
                    <td className="py-2 pr-3">{m.due_date ?? '-'}</td>
                    <td className="py-2 pr-3 text-right">
                      {m.weightage ?? '-'}
                    </td>
                    <td className="py-2 pr-3 text-right">
                      {m.percent_complete != null
                        ? `${m.percent_complete}%`
                        : '-'}
                    </td>
                    <td className="py-2">
                      <StatusPill
                        status={m.status}
                        label={MILESTONE_LABELS[m.status] ?? m.status}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <h2 className="mt-6 text-lg font-semibold">Open Risks</h2>
          {openRisks.length === 0 ? (
            <p className="mt-2 text-sm text-muted-foreground">
              No open risks.
            </p>
          ) : (
            <table className="mt-2 w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs text-muted-foreground">
                  <th className="py-2 pr-3 font-medium">Risk</th>
                  <th className="py-2 pr-3 font-medium">Probability</th>
                  <th className="py-2 pr-3 font-medium">Impact</th>
                  <th className="py-2 pr-3 text-right font-medium">Score</th>
                  <th className="py-2 font-medium">Owner</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {openRisks.map((r) => (
                  <tr key={r.id}>
                    <td className="py-2 pr-3 font-medium">{r.statement}</td>
                    <td className="py-2 pr-3">{r.probability?.name ?? '-'}</td>
                    <td className="py-2 pr-3">{r.impact?.name ?? '-'}</td>
                    <td className="py-2 pr-3 text-right">
                      {riskScore(r.probability, r.impact) ?? '-'}
                    </td>
                    <td className="py-2">
                      {r.owner?.full_name ?? r.owner?.email ?? '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <h2 className="mt-6 text-lg font-semibold">Open Issues</h2>
          {openIssues.length === 0 ? (
            <p className="mt-2 text-sm text-muted-foreground">
              No open issues.
            </p>
          ) : (
            <table className="mt-2 w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs text-muted-foreground">
                  <th className="py-2 pr-3 font-medium">Issue</th>
                  <th className="py-2 pr-3 font-medium">Level</th>
                  <th className="py-2 pr-3 font-medium">Reported By</th>
                  <th className="py-2 font-medium">Recommendation</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {openIssues.map((i) => (
                  <tr key={i.id}>
                    <td className="py-2 pr-3 font-medium">{i.title}</td>
                    <td className="py-2 pr-3">{i.level?.name ?? '-'}</td>
                    <td className="py-2 pr-3">{i.reported_by ?? '-'}</td>
                    <td className="py-2">{i.recommendation ?? '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <div className="mt-8 border-t pt-4 text-xs text-muted-foreground">
            Generated by P-Track. Progress figures follow docs/FORMULAS.md
            (provisional formulas pending sign-off).
          </div>
        </div>
      </div>
    </div>
  )
}
