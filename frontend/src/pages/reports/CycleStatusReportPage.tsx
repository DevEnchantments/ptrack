import { Loader2, Lock, LockOpen, Printer } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { cyclesApi, reportsApi, type CycleStatusReport } from '@/lib/api'
import { toast } from '@/lib/toast'
import { usePageTitle } from '@/lib/use-page-title'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Chip } from '@/components/WorkflowPanel'

/** Portfolio-wide submission status for the current reporting cycle. */
export function CycleStatusReportPage() {
  usePageTitle('Cycle Submission Status')
  const navigate = useNavigate()
  const [report, setReport] = useState<CycleStatusReport | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [armed, setArmed] = useState(false)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    reportsApi
      .cycleStatus()
      .then(setReport)
      .catch((e: Error) => setError(e.message))
  }, [])

  // Cycle rows are created lazily; a missing row means implicitly open.
  const closed = report?.cycle?.status === 'closed'

  async function setCycle(action: 'close' | 'reopen') {
    setBusy(true)
    try {
      await (action === 'close' ? cyclesApi.close() : cyclesApi.reopen())
      toast.success(action === 'close' ? 'Cycle closed.' : 'Cycle reopened.')
      setArmed(false)
      setReport(await reportsApi.cycleStatus())
    } catch (e) {
      toast.error((e as Error).message)
    } finally {
      setBusy(false)
    }
  }

  if (error) {
    return (
      <div className="p-6">
        <p className="text-destructive">{error}</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => navigate('/reporting')}
        >
          Back to reports
        </Button>
      </div>
    )
  }

  if (!report) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <Skeleton className="h-8 w-72" />
        <Skeleton className="mt-4 h-64 w-full rounded-md" />
      </div>
    )
  }

  const counts = report.rows.reduce<Record<string, number>>((acc, r) => {
    acc[r.status] = (acc[r.status] ?? 0) + 1
    return acc
  }, {})
  const submitted = report.rows.length - (counts.not_submitted ?? 0)
  const cycleName =
    report.cycle?.name ??
    new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  return (
    <div className="animate-step-in mx-auto max-w-4xl p-6 print:max-w-none print:p-0">
      <div className="mb-6 flex items-center justify-between gap-3 print:hidden">
        <button
          onClick={() => navigate('/reporting')}
          className="text-sm text-muted-foreground hover:underline"
        >
          Reports
        </button>
        <div className="flex items-center gap-2">
          {closed ? (
            <Button
              variant="outline"
              size="sm"
              disabled={busy}
              onClick={() => void setCycle('reopen')}
            >
              {busy ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <LockOpen className="h-4 w-4" />
              )}
              Reopen Cycle
            </Button>
          ) : armed ? (
            <Button
              variant="destructive"
              size="sm"
              disabled={busy}
              onClick={() => void setCycle('close')}
            >
              {busy ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Lock className="h-4 w-4" />
              )}
              Confirm close
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={() => setArmed(true)}>
              <Lock className="h-4 w-4" />
              Close Current Cycle
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            <Printer className="h-4 w-4" />
            Print
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-md border print:rounded-none print:border-0">
        <div className="bg-brand px-6 py-4">
          <span className="text-sm font-semibold tracking-wide text-brand-foreground">
            P-TRACK
          </span>
        </div>
        <div className="px-6 py-5">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl font-semibold">Cycle Submission Status</h1>
            {closed && (
              <span className="inline-flex items-center gap-1 rounded-full border border-status-amber-border bg-status-amber-bg px-2 py-0.5 text-xs font-medium text-status-amber-fg">
                <Lock className="h-3 w-3" />
                Cycle closed
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {cycleName} · generated {new Date().toISOString().slice(0, 10)} ·{' '}
            {submitted}/{report.rows.length} projects submitted
          </p>

          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
            {Object.entries(counts).map(([status, n]) => (
              <span key={status} className="flex items-center gap-1.5">
                <Chip status={status} /> {n}
              </span>
            ))}
          </div>

          <table className="mt-5 w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs text-muted-foreground">
                <th className="py-2 pr-3 font-medium">Project</th>
                <th className="py-2 pr-3 font-medium">Owner</th>
                <th className="py-2 pr-3 font-medium">Project Manager</th>
                <th className="py-2 pr-3 font-medium">Status</th>
                <th className="py-2 font-medium">Submitted</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {report.rows.map((r) => (
                <tr key={r.project_id}>
                  <td className="py-2.5 pr-3 font-medium">
                    <button
                      type="button"
                      onClick={() => navigate(`/projects/${r.project_id}`)}
                      className="text-left hover:underline print:no-underline"
                    >
                      {r.name}
                    </button>
                  </td>
                  <td className="py-2.5 pr-3">{r.owner ?? '-'}</td>
                  <td className="py-2.5 pr-3">{r.project_manager ?? '-'}</td>
                  <td className="py-2.5 pr-3">
                    <Chip status={r.status} />
                  </td>
                  <td className="py-2.5">
                    {r.submitted_at ? r.submitted_at.slice(0, 10) : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
