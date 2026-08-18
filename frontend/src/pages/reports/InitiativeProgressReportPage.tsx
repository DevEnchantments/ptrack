import { Printer } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { reportsApi, type InitiativeProgressRow } from '@/lib/api'
import { usePageTitle } from '@/lib/use-page-title'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

const BUCKET_CHIP: Record<string, string> = {
  Completed: 'border-status-blue-border bg-status-blue-bg text-status-blue-fg',
  'Over-Achieved':
    'border-status-green-border bg-status-green-bg text-status-green-fg',
  'On Target':
    'border-status-green-border bg-status-green-bg text-status-green-fg',
  'Needs Attention':
    'border-status-amber-border bg-status-amber-bg text-status-amber-fg',
  'Off Target': 'border-status-red-border bg-status-red-bg text-status-red-fg',
  'Severely Off Target':
    'border-status-red-border bg-status-red-bg text-status-red-fg',
  'Not Started': 'border-transparent bg-muted text-muted-foreground',
}

function BucketChip({ bucket }: { bucket: string | null }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center whitespace-nowrap rounded-full border px-2 py-0.5 text-xs font-medium ${
        (bucket && BUCKET_CHIP[bucket]) ??
        'border-transparent bg-muted text-muted-foreground'
      }`}
    >
      {bucket ?? 'Cancelled'}
    </span>
  )
}

/**
 * FR-12 Initiative Progress report: planned vs calculated progress per
 * project with the F5 delivery bucket (formulas PROVISIONAL), worst first.
 */
export function InitiativeProgressReportPage() {
  usePageTitle('Initiative Progress Report')
  const navigate = useNavigate()
  const [rows, setRows] = useState<InitiativeProgressRow[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(() => {
    reportsApi
      .initiativeProgress()
      .then((r) => setRows(r.rows))
      .catch((e: Error) => setError(e.message))
  }, [])
  useEffect(load, [load])
  const retry = () => {
    setError(null)
    load()
  }

  if (error) {
    return (
      <div className="p-6">
        <p className="text-destructive">{error}</p>
        <div className="mt-4 flex gap-2">
          <Button onClick={retry}>Retry</Button>
          <Button variant="outline" onClick={() => navigate('/reporting')}>
            Back to reports
          </Button>
        </div>
      </div>
    )
  }

  if (!rows) {
    return (
      <div className="mx-auto max-w-5xl p-6">
        <Skeleton className="h-8 w-72" />
        <Skeleton className="mt-4 h-64 w-full rounded-md" />
      </div>
    )
  }

  return (
    <div className="animate-step-in mx-auto max-w-5xl p-6 print:max-w-none print:p-0">
      <div className="mb-6 flex items-center justify-between gap-3 print:hidden">
        <button
          onClick={() => navigate('/reporting')}
          className="text-sm text-muted-foreground hover:underline"
        >
          Reports
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
          <h1 className="text-2xl font-semibold">Initiative Progress</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Planned vs calculated progress per initiative, worst delta first ·
            generated {new Date().toISOString().slice(0, 10)} · {rows.length}{' '}
            initiatives · formulas provisional pending sign-off
          </p>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs text-muted-foreground">
                  <th className="py-2 pr-3 font-medium">Initiative</th>
                  <th className="py-2 pr-3 font-medium">Owner</th>
                  <th className="py-2 pr-3 font-medium">Project Manager</th>
                  <th className="py-2 pr-3 text-right font-medium">Planned</th>
                  <th className="py-2 pr-3 text-right font-medium">Actual</th>
                  <th className="py-2 pr-3 text-right font-medium">Delta</th>
                  <th className="py-2 pr-3 text-right font-medium">
                    Milestones
                  </th>
                  <th className="py-2 font-medium">Bucket</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {rows.map((r) => (
                  <tr key={r.project_id}>
                    <td className="max-w-64 py-2.5 pr-3">
                      <button
                        type="button"
                        onClick={() => navigate(`/projects/${r.project_id}`)}
                        className="block max-w-full truncate text-left font-medium hover:underline print:no-underline"
                        title={r.name}
                      >
                        {r.name}
                      </button>
                      <span className="block text-xs text-muted-foreground">
                        {[r.reference_id, r.status]
                          .filter(Boolean)
                          .join(' · ') || '-'}
                      </span>
                    </td>
                    <td className="py-2.5 pr-3">{r.owner ?? '-'}</td>
                    <td className="py-2.5 pr-3">{r.project_manager ?? '-'}</td>
                    <td className="py-2.5 pr-3 text-right tabular-nums">
                      {r.planned === null ? '-' : `${r.planned}%`}
                    </td>
                    <td className="py-2.5 pr-3 text-right tabular-nums">
                      {r.calculated === null ? '-' : `${r.calculated}%`}
                    </td>
                    <td
                      className={`py-2.5 pr-3 text-right font-medium tabular-nums ${
                        r.delta === null
                          ? 'text-muted-foreground'
                          : r.delta < -5
                            ? 'text-destructive'
                            : 'text-[var(--status-green-fg)]'
                      }`}
                    >
                      {r.delta === null
                        ? '-'
                        : `${r.delta > 0 ? '+' : ''}${r.delta}`}
                    </td>
                    <td className="py-2.5 pr-3 text-right tabular-nums">
                      {r.milestones_total === 0
                        ? '-'
                        : `${r.milestones_done}/${r.milestones_total}`}
                    </td>
                    <td className="py-2.5">
                      <BucketChip bucket={r.bucket} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
