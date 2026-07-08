import { useCallback, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  statusReportsApi,
  type StatusReportDetail,
  type StatusReport,
} from '@/lib/api'
import { Button } from '@/components/ui/button'
import { MiniCalendar } from '@/components/MiniCalendar'

const ACCESS_LABELS: Record<string, string> = {
  submitter: 'Submitter',
  submitter_and_members: 'Submitter and Project Members',
  all: 'All',
  all_contributors: 'All Contributors',
}

function authorName(a: { full_name: string | null; email: string | null } | null) {
  return a?.full_name || a?.email || 'Unknown'
}

function longDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00')
  if (isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function StatusReportDetailPage() {
  const { projectId, statusReportId } = useParams<{
    projectId: string
    statusReportId: string
  }>()
  const navigate = useNavigate()
  const [report, setReport] = useState<StatusReportDetail | null>(null)
  const [others, setOthers] = useState<StatusReport[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(() => {
    if (!projectId || !statusReportId) return
    statusReportsApi
      .get(projectId, statusReportId)
      .then(setReport)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false))
    statusReportsApi
      .list(projectId)
      .then((list) => setOthers(list.filter((r) => r.id !== statusReportId)))
      .catch(() => {})
  }, [projectId, statusReportId])

  useEffect(() => {
    load()
  }, [load])

  if (loading) {
    return <div className="p-6 text-muted-foreground">Loading…</div>
  }
  if (error || !report) {
    return (
      <div className="p-6">
        <p className="text-destructive">{error ?? 'Status report not found.'}</p>
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

  const projectName = report.project?.name ?? 'Project'

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
        <button
          onClick={() => navigate(`/projects/${projectId}`)}
          className="text-sm text-muted-foreground hover:underline"
        >
          {projectName}
        </button>
        <span className="mx-2 text-muted-foreground">/</span>
        <span className="text-sm">{report.title ?? 'Status Report'}</span>
      </header>

      <div className="mx-auto max-w-5xl p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Status Report</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled title="Coming in a later step">
              Email
            </Button>
            <Button variant="outline" size="sm" disabled title="Coming in a later step">
              Edit Status Report
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/projects/${projectId}`)}
            >
              View Project
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_280px]">
          <div className="overflow-hidden rounded-md border">
            <div className="bg-red-600 px-6 py-4">
              <span className="text-sm font-semibold tracking-wide text-white">
                P-TRACK
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 bg-muted px-6 py-5">
              <h2 className="text-xl font-semibold">{projectName}</h2>
              <Button
                size="sm"
                onClick={() => navigate(`/projects/${projectId}`)}
              >
                View Project
              </Button>
            </div>

            <div className="px-6 py-5">
              <div className="mb-4 rounded-md border bg-muted/40 px-4 py-3">
                <h3 className="text-lg font-medium">Status Report</h3>
              </div>

              <p className="whitespace-pre-wrap text-sm">{report.summary}</p>

              <p className="mt-4 text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">Submitted:</span>{' '}
                {longDate(report.report_date)} by {authorName(report.author)}
              </p>

              <div className="mt-8 border-t pt-4 text-xs text-muted-foreground">
                This is a system generated message. Do not reply to this
                message. Please contact your application administrator for
                further assistance.
              </div>
            </div>
          </div>

          <aside className="flex flex-col gap-6">
            <div className="rounded-md border p-4">
              <h3 className="mb-3 text-sm font-semibold">Visibility</h3>
              <p className="text-sm">
                <span className="font-medium">Viewable By:</span>{' '}
                {ACCESS_LABELS[report.viewable_by] ?? report.viewable_by}
              </p>
              <p className="mt-1 text-sm">
                <span className="font-medium">Editable By:</span>{' '}
                {ACCESS_LABELS[report.editable_by] ?? report.editable_by}
              </p>
            </div>

            <div className="rounded-md border p-4">
              <h3 className="mb-3 text-sm font-semibold">Submitted On</h3>
              <MiniCalendar label="" date={report.report_date} />
            </div>

            <div className="rounded-md border p-4">
              <h3 className="mb-3 text-sm font-semibold">Recent Reports</h3>
              {others.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No other reports found.
                </p>
              ) : (
                <ul className="flex flex-col gap-2">
                  {others.slice(0, 5).map((r) => (
                    <li key={r.id}>
                      <button
                        onClick={() =>
                          navigate(
                            `/projects/${projectId}/status-reports/${r.id}`,
                          )
                        }
                        className="text-left text-sm text-primary hover:underline"
                      >
                        {r.title || 'Untitled'}
                      </button>
                      <div className="text-xs text-muted-foreground">
                        {longDate(r.report_date)}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}