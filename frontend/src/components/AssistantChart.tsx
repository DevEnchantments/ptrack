import { lazy, Suspense } from 'react'
import { Loader2 } from 'lucide-react'
import type { ChartSpec } from '@/lib/api/assistant'

// ECharts is ~350 KB; load it only when a chart is actually shown.
const AssistantEChart = lazy(() => import('./AssistantEChart'))

/** A chart the assistant asked the UI to draw, framed like a card. */
export function AssistantChart({ spec }: { spec: ChartSpec }) {
  return (
    <figure className="my-3 rounded-md border border-border bg-card p-3 first:mt-0">
      <figcaption className="mb-1 text-sm font-semibold text-foreground">
        {spec.title}
      </figcaption>
      <Suspense
        fallback={
          <div className="flex h-[300px] items-center justify-center">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        }
      >
        <AssistantEChart spec={spec} />
      </Suspense>
    </figure>
  )
}
