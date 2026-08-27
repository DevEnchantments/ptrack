import { useEffect, useRef } from 'react'
import * as echarts from 'echarts/core'
import { BarChart, CustomChart, LineChart, PieChart } from 'echarts/charts'
import {
  AriaComponent,
  GridComponent,
  LegendComponent,
  TooltipComponent,
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import type { EChartsOption } from 'echarts'
import type { ChartSpec } from '@/lib/api/assistant'

echarts.use([
  BarChart,
  LineChart,
  PieChart,
  CustomChart,
  GridComponent,
  LegendComponent,
  TooltipComponent,
  AriaComponent,
  CanvasRenderer,
])

/** Reads the app's design tokens so the canvas matches the current theme. */
function themeColors() {
  const css = getComputedStyle(document.documentElement)
  const t = (name: string) => css.getPropertyValue(name).trim()
  return {
    series: [t('--chart-1'), t('--chart-2'), t('--chart-3'), t('--chart-4')],
    ink: t('--foreground'),
    muted: t('--muted-foreground'),
    border: t('--border'),
    card: t('--card'),
    primary: t('--primary'),
  }
}

const fmt = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 })
const withUnit = (v: number, unit?: string) =>
  unit === '%' ? `${fmt.format(v)}%` : unit ? `${unit} ${fmt.format(v)}` : fmt.format(v)

/** Compact axis labels: 1,200,000 -> 1.2M. */
const compact = (v: number) =>
  Math.abs(v) >= 1e9
    ? `${fmt.format(v / 1e9)}B`
    : Math.abs(v) >= 1e6
      ? `${fmt.format(v / 1e6)}M`
      : Math.abs(v) >= 1e3
        ? `${fmt.format(v / 1e3)}K`
        : fmt.format(v)

const DAY = 86_400_000

function buildOption(
  spec: ChartSpec,
  c: ReturnType<typeof themeColors>,
  animate: boolean,
): EChartsOption {
  const base: EChartsOption = {
    color: c.series,
    animation: animate,
    textStyle: { color: c.ink, fontFamily: 'inherit' },
    aria: { enabled: true },
    tooltip: {
      backgroundColor: c.card,
      borderColor: c.border,
      textStyle: { color: c.ink },
    },
    legend: { textStyle: { color: c.muted }, top: 0, icon: 'roundRect' },
  }

  if (spec.type === 'donut') {
    return {
      ...base,
      tooltip: {
        ...base.tooltip,
        trigger: 'item',
        valueFormatter: (v) => withUnit(Number(v), spec.unit),
      },
      series: [
        {
          type: 'pie',
          radius: ['48%', '74%'],
          top: 28,
          avoidLabelOverlap: true,
          itemStyle: { borderColor: c.card, borderWidth: 2 },
          label: { color: c.ink, formatter: '{b}: {d}%' },
          data: spec.slices.map((s) => ({ name: s.label, value: s.value })),
        },
      ],
    }
  }

  if (spec.type === 'timeline') {
    const labels = spec.items.map((i) => i.label)
    const starts = spec.items.map((i) => Date.parse(i.start))
    const ends = spec.items.map((i) => Date.parse(i.end) + DAY)
    return {
      ...base,
      legend: { show: false },
      tooltip: {
        ...base.tooltip,
        trigger: 'item',
        formatter: (p) => {
          const params = p as { dataIndex: number }
          const it = spec.items[params.dataIndex]
          const prog = it.progress === undefined ? '' : ` · ${it.progress}%`
          return `<b>${it.label}</b><br/>${it.start} → ${it.end}${prog}`
        },
      },
      grid: { left: 8, right: 16, top: 8, bottom: 8, containLabel: true },
      xAxis: {
        type: 'time',
        min: Math.min(...starts),
        max: Math.max(...ends),
        axisLabel: { color: c.muted },
        axisLine: { lineStyle: { color: c.border } },
        splitLine: { lineStyle: { color: c.border } },
      },
      yAxis: {
        type: 'category',
        data: labels,
        inverse: true,
        axisLabel: { color: c.ink, width: 180, overflow: 'truncate' },
        axisLine: { lineStyle: { color: c.border } },
        axisTick: { show: false },
      },
      series: [
        {
          type: 'custom',
          encode: { x: [1, 2], y: 0 },
          data: spec.items.map((it, i) => [i, starts[i], ends[i], it.progress ?? null]),
          renderItem: (_params, api) => {
            const idx = api.value(0) as number
            const start = api.coord([api.value(1), idx])
            const end = api.coord([api.value(2), idx])
            const height = Math.min(22, (api.size?.([0, 1]) as number[])[1] * 0.6)
            const width = Math.max(end[0] - start[0], 2)
            const progress = api.value(3) as number | null
            const rect = (w: number, fill: string, opacity: number) => ({
              type: 'rect' as const,
              shape: { x: start[0], y: start[1] - height / 2, width: w, height, r: 4 },
              style: { fill, opacity },
            })
            return {
              type: 'group',
              children: [
                rect(width, c.series[2], 0.3),
                ...(progress === null
                  ? []
                  : [rect((width * progress) / 100, c.series[2], 1)]),
              ],
            }
          },
        },
      ],
    }
  }

  // bar / stacked_bar / line
  const stacked = spec.type === 'stacked_bar'
  return {
    ...base,
    tooltip: {
      ...base.tooltip,
      trigger: 'axis',
      valueFormatter: (v) => withUnit(Number(v), spec.unit),
    },
    grid: { left: 8, right: 16, top: 40, bottom: 8, containLabel: true },
    xAxis: {
      type: 'category',
      data: spec.categories,
      axisLabel: {
        color: c.muted,
        interval: 0,
        width: 90,
        overflow: 'truncate',
        rotate: spec.categories.length > 6 ? 30 : 0,
      },
      axisLine: { lineStyle: { color: c.border } },
      axisTick: { show: false },
    },
    yAxis: {
      type: 'value',
      name: spec.unit,
      nameTextStyle: { color: c.muted, align: 'left' },
      axisLabel: { color: c.muted, formatter: (v: number) => compact(v) },
      splitLine: { lineStyle: { color: c.border } },
    },
    series: spec.series.map((s) =>
      spec.type === 'line'
        ? {
            type: 'line',
            name: s.name,
            data: s.values,
            smooth: true,
            symbolSize: 6,
            lineStyle: { width: 2 },
          }
        : {
            type: 'bar',
            name: s.name,
            data: s.values,
            stack: stacked ? 'total' : undefined,
            barMaxWidth: 36,
            itemStyle: { borderRadius: stacked ? 0 : [4, 4, 0, 0] },
          },
    ),
  }
}

/** ECharts canvas for one assistant chart; theme follows the app tokens. */
export default function AssistantEChart({ spec }: { spec: ChartSpec }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const chart = echarts.init(el, undefined, { renderer: 'canvas' })
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const render = () => chart.setOption(buildOption(spec, themeColors(), !reduceMotion), true)
    render()

    // Re-theme when the app toggles the .dark class on <html>.
    const observer = new MutationObserver(render)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    const resize = new ResizeObserver(() => chart.resize())
    resize.observe(el)
    return () => {
      observer.disconnect()
      resize.disconnect()
      chart.dispose()
    }
  }, [spec])

  const height = spec.type === 'timeline' ? Math.min(60 + spec.items.length * 32, 520) : 300
  return <div ref={ref} style={{ height }} className="w-full" />
}
