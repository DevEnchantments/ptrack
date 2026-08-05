import { useNavigate } from 'react-router-dom'
import { CalendarCheck, FileBarChart } from 'lucide-react'
import { usePageTitle } from '@/lib/use-page-title'

/** Reports hub — the sidebar's Reporting item, no longer a Phase-2 stub. */
export function ReportingPage() {
  usePageTitle('Reporting')
  const navigate = useNavigate()

  return (
    <div className="mx-auto max-w-3xl p-6">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Reporting
      </p>
      <h1 className="text-2xl font-semibold">Reports</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Printable reports built from live data. More arrive with the dashboards
        wave.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => navigate('/reporting/cycle-status')}
          className="stagger-in flex cursor-pointer flex-col items-start gap-2 rounded-lg border bg-card p-5 text-left shadow-xs transition-[translate,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-2 focus-visible:outline-ring"
        >
          <CalendarCheck className="h-5 w-5 text-primary" />
          <span className="text-base font-semibold">
            Cycle Submission Status
          </span>
          <span className="text-sm text-muted-foreground">
            Which projects have submitted, been validated, or been approved for
            the current reporting cycle.
          </span>
        </button>

        <div className="stagger-in flex flex-col items-start gap-2 rounded-lg border bg-card p-5 shadow-xs" style={{ animationDelay: '40ms' }}>
          <FileBarChart className="h-5 w-5 text-primary" />
          <span className="text-base font-semibold">
            Project Progress Report
          </span>
          <span className="text-sm text-muted-foreground">
            Per-project: open any project and use its Report button in the
            title row.
          </span>
        </div>
      </div>
    </div>
  )
}
