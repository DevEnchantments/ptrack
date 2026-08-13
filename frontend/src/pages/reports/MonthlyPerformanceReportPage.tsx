import { ChevronLeft, ChevronRight, Printer } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { reportsApi, type MonthlyPerformanceMonth } from '@/lib/api'
import { usePageTitle } from '@/lib/use-page-title'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

/**
 * FR-12 Monthly Performance report: milestone delivery and submission
 * counts per calendar month of the chosen year.
 */
export function MonthlyPerformanceReportPage() {
  usePageTitle('Monthly Performance Report')
  const navigate = useNavigate()
  const currentYear = new Date().getFullYear()
  const [year, setYear] = useState(currentYear)
  const [data, setData] = useState<{
    year: number
    months: MonthlyPerformanceMonth[]
  } | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    reportsApi
      .monthlyPerformance(year)
      .then(setData)
      .catch((e: Error) => setError(e.message))
  }, [year])

  // Data from a previous year selection counts as loading, not content.
  const months = data?.year === year ? data.months : null

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

  const currentMonth = new Date().getMonth()
  const totals = (months ?? []).reduce(
    (acc, m) => ({
      due: acc.due + m.due,
      done: acc.done + m.done,
      completed: acc.completed + m.completed,
      submitted: acc.submitted + m.submitted,
      approved: acc.approved + m.approved,
    }),
    { due: 0, done: 0, completed: 0, submitted: 0, approved: 0 },
  )

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
          <div className="flex items-center gap-1 rounded-md border p-0.5">
            <Button
              variant="ghost"
              size="sm"
              aria-label="Previous year"
              onClick={() => setYear((y) => y - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="min-w-12 text-center text-sm font-medium tabular-nums">
              {year}
            </span>
            <Button
              variant="ghost"
              size="sm"
              aria-label="Next year"
              onClick={() => setYear((y) => y + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
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
          <h1 className="text-2xl font-semibold">Monthly Performance</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {year} · milestone delivery and reporting-cycle submissions per
            month · generated {new Date().toISOString().slice(0, 10)}
          </p>

          {!months ? (
            <Skeleton className="mt-5 h-80 w-full rounded-md" />
          ) : (
            <table className="mt-5 w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs text-muted-foreground">
                  <th className="py-2 pr-3 font-medium">Month</th>
                  <th className="py-2 pr-3 text-right font-medium">
                    Milestones due
                  </th>
                  <th className="py-2 pr-3 text-right font-medium">
                    Done of due
                  </th>
                  <th className="py-2 pr-3 text-right font-medium">Rate</th>
                  <th className="py-2 pr-3 text-right font-medium">
                    Completed in month
                  </th>
                  <th className="py-2 pr-3 text-right font-medium">
                    Submissions
                  </th>
                  <th className="py-2 text-right font-medium">Approved</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {months.map((m, i) => (
                  <tr
                    key={m.label}
                    className={
                      year === currentYear && i === currentMonth
                        ? 'bg-primary/5'
                        : undefined
                    }
                  >
                    <td className="py-2.5 pr-3 font-medium">{m.label}</td>
                    <td className="py-2.5 pr-3 text-right tabular-nums">
                      {m.due}
                    </td>
                    <td className="py-2.5 pr-3 text-right tabular-nums">
                      {m.done}
                    </td>
                    <td className="py-2.5 pr-3 text-right tabular-nums">
                      {m.due === 0 ? '-' : `${Math.round((m.done / m.due) * 100)}%`}
                    </td>
                    <td className="py-2.5 pr-3 text-right tabular-nums">
                      {m.completed}
                    </td>
                    <td className="py-2.5 pr-3 text-right tabular-nums">
                      {m.submitted}
                    </td>
                    <td className="py-2.5 text-right tabular-nums">
                      {m.approved}
                    </td>
                  </tr>
                ))}
                <tr className="border-t font-medium">
                  <td className="py-2.5 pr-3">Total</td>
                  <td className="py-2.5 pr-3 text-right tabular-nums">
                    {totals.due}
                  </td>
                  <td className="py-2.5 pr-3 text-right tabular-nums">
                    {totals.done}
                  </td>
                  <td className="py-2.5 pr-3 text-right tabular-nums">
                    {totals.due === 0
                      ? '-'
                      : `${Math.round((totals.done / totals.due) * 100)}%`}
                  </td>
                  <td className="py-2.5 pr-3 text-right tabular-nums">
                    {totals.completed}
                  </td>
                  <td className="py-2.5 pr-3 text-right tabular-nums">
                    {totals.submitted}
                  </td>
                  <td className="py-2.5 text-right tabular-nums">
                    {totals.approved}
                  </td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
