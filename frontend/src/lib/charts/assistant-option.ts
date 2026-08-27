import type { EChartsOption } from 'echarts'
import type { ChartSpec } from '@/lib/api/assistant'
import { compactNumber, withUnit, type ChartTheme } from './theme'

const DAY = 86_400_000

/** ECharts option for a validated assistant chart spec. */
export function assistantChartOption(
  spec: ChartSpec,
  c: ChartTheme,
  animate: boolean,
): EChartsOption {
  const base: EChartsOption = {
    color: c.series,
    animation: animate,
    textStyle: { color: c.ink, fontFamily: 'inherit' },
    tooltip: {
      backgroundColor: c.popover,
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
    const starts = spec.items.map((i) => Date.parse(i.start))
    const ends = spec.items.map((i) => Date.parse(i.end) + DAY)
    return {
      ...base,
      legend: { show: false },
      tooltip: {
        ...base.tooltip,
        trigger: 'item',
        formatter: (p) => {
          const it = spec.items[(p as { dataIndex: number }).dataIndex]
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
        data: spec.items.map((i) => i.label),
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
            const rect = (w: number, opacity: number) => ({
              type: 'rect' as const,
              shape: { x: start[0], y: start[1] - height / 2, width: w, height, r: 4 },
              style: { fill: c.series[2], opacity },
            })
            return {
              type: 'group',
              children: [
                rect(width, 0.3),
                ...(progress === null ? [] : [rect((width * progress) / 100, 1)]),
              ],
            }
          },
        },
      ],
    }
  }

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
      axisLabel: { color: c.muted, formatter: (v: number) => compactNumber(v) },
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
