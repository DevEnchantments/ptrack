import { useCallback } from 'react'
import type { ChartSpec } from '@/lib/api/assistant'
import { assistantChartOption } from '@/lib/charts/assistant-option'
import { withUnit, type ChartTheme } from '@/lib/charts/theme'
import { EChart } from '@/components/charts/EChart'

function summaryOf(spec: ChartSpec): { label: string; value: string }[] {
  if (spec.type === 'donut') {
    return spec.slices.map((s) => ({ label: s.label, value: withUnit(s.value, spec.unit) }))
  }
  if (spec.type === 'timeline') {
    return spec.items.map((i) => ({ label: i.label, value: `${i.start} to ${i.end}` }))
  }
  return spec.categories.map((cat, i) => ({
    label: cat,
    value: spec.series.map((s) => `${s.name} ${withUnit(s.values[i], spec.unit)}`).join(', '),
  }))
}

/** A chart the assistant asked the UI to draw, framed like a card. */
export function AssistantChart({ spec }: { spec: ChartSpec }) {
  const build = useCallback(
    (theme: ChartTheme, animate: boolean) => assistantChartOption(spec, theme, animate),
    [spec],
  )
  const height = spec.type === 'timeline' ? Math.min(60 + spec.items.length * 32, 520) : 300
  return (
    <figure className="my-3 rounded-md border border-border bg-card p-3 first:mt-0">
      <figcaption className="mb-1 text-sm font-semibold text-foreground">
        {spec.title}
      </figcaption>
      <EChart build={build} height={height} summary={summaryOf(spec)} summaryTitle={spec.title} />
    </figure>
  )
}
