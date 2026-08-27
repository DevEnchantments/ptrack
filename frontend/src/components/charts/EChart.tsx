import { lazy, Suspense } from 'react'
import { Loader2 } from 'lucide-react'
import type { EChartHostProps } from './EChartHost'

// ECharts is a sizeable chunk; it loads the first time any chart is shown.
const EChartHost = lazy(() => import('./EChartHost'))

export interface EChartProps extends EChartHostProps {
  /** Screen-reader alternative: the chart's data as a plain list. */
  summary?: { label: string; value: string | number }[]
  summaryTitle?: string
}

/** A themed ECharts canvas with a loading fallback and an accessible data list. */
export function EChart({ summary, summaryTitle, ...host }: EChartProps) {
  return (
    <>
      <Suspense
        fallback={
          <div
            style={{ height: host.height }}
            className="flex w-full items-center justify-center"
          >
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        }
      >
        <EChartHost {...host} />
      </Suspense>
      {summary && summary.length > 0 && (
        <dl className="sr-only">
          {summaryTitle && <dt>{summaryTitle}</dt>}
          {summary.map((s) => (
            <div key={s.label}>
              <dt>{s.label}</dt>
              <dd>{s.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </>
  )
}
