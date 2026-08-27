import type { EChartsOption } from 'echarts'
import { resolveCssColor, type ChartTheme } from './theme'

export interface Segment {
  label: string
  value: number
  /** Any CSS color, including `var(--token)` strings. */
  color: string
}

function baseOption(c: ChartTheme, animate: boolean): EChartsOption {
  return {
    animation: animate,
    animationDuration: 800,
    textStyle: { color: c.ink, fontFamily: 'inherit' },
    tooltip: {
      backgroundColor: c.popover,
      borderColor: c.border,
      textStyle: { color: c.ink, fontSize: 12 },
    },
  }
}

/** Donut with the total (or a hovered segment) read out in the center. */
export function donutOption(
  segments: Segment[],
  centerLabel: string,
  c: ChartTheme,
  animate: boolean,
): EChartsOption {
  const shown = segments.filter((s) => s.value > 0)
  const total = segments.reduce((sum, s) => sum + s.value, 0)
  return {
    ...baseOption(c, animate),
    tooltip: { ...baseOption(c, animate).tooltip, trigger: 'item' },
    // Center readout: total by default; ECharts swaps to the hovered slice.
    graphic: [
      {
        type: 'text',
        left: 'center',
        top: 'middle',
        style: {
          text: `${total}\n${centerLabel}`,
          align: 'center',
          fill: c.ink,
          font: '600 20px inherit',
          lineHeight: 22,
        },
      },
    ],
    series: [
      {
        type: 'pie',
        radius: ['66%', '88%'],
        avoidLabelOverlap: false,
        label: { show: false },
        emphasis: { scale: true, scaleSize: 4 },
        itemStyle: { borderColor: c.card, borderWidth: 2, borderRadius: 3 },
        data: shown.map((s) => ({
          name: s.label,
          value: s.value,
          itemStyle: { color: resolveCssColor(s.color) },
        })),
      },
    ],
  }
}

/** One or more weekly series as smoothed lines with a shared crosshair. */
export function lineOption(
  labels: string[],
  series: { label: string; color: string; values: number[]; area?: boolean }[],
  c: ChartTheme,
  animate: boolean,
): EChartsOption {
  const max = Math.max(4, Math.ceil(Math.max(...series.flatMap((s) => s.values)) / 4) * 4)
  return {
    ...baseOption(c, animate),
    tooltip: {
      ...baseOption(c, animate).tooltip,
      trigger: 'axis',
      axisPointer: { type: 'line', lineStyle: { color: c.muted, opacity: 0.4 } },
    },
    grid: { left: 8, right: 16, top: 16, bottom: 4, containLabel: true },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: labels,
      axisLabel: { color: c.muted, fontSize: 10 },
      axisLine: { lineStyle: { color: c.border } },
      axisTick: { show: false },
    },
    yAxis: {
      type: 'value',
      max,
      interval: max / 4,
      axisLabel: { color: c.muted, fontSize: 10 },
      splitLine: { lineStyle: { color: c.border } },
    },
    series: series.map((s, i) => ({
      type: 'line',
      name: s.label,
      data: s.values,
      smooth: true,
      symbol: 'circle',
      symbolSize: 6,
      showSymbol: false,
      lineStyle: { width: 2, color: resolveCssColor(s.color) },
      itemStyle: { color: resolveCssColor(s.color), borderColor: c.card, borderWidth: 2 },
      areaStyle: s.area ? { color: resolveCssColor(s.color), opacity: 0.12 } : undefined,
      // Direct label on the latest point only, in ink.
      label: {
        show: true,
        position: 'top',
        color: c.ink,
        fontSize: 11,
        fontWeight: 500,
        formatter: (p: { dataIndex: number; value: unknown }) =>
          p.dataIndex === s.values.length - 1 ? String(p.value) : '',
      },
      animationDelay: i * 200,
    })),
  }
}

/** 100% stacked horizontal bar of a few segments (open / closed / overdue). */
export function breakdownOption(
  segments: Segment[],
  c: ChartTheme,
  animate: boolean,
): EChartsOption {
  const total = segments.reduce((s, d) => s + d.value, 0)
  return {
    ...baseOption(c, animate),
    tooltip: {
      ...baseOption(c, animate).tooltip,
      trigger: 'item',
      formatter: (p) => {
        const { seriesName, value } = p as { seriesName: string; value: number }
        const pct = total > 0 ? Math.round((value / total) * 100) : 0
        return `${seriesName}: <b>${value}</b> (${pct}%)`
      },
    },
    grid: { left: 0, right: 0, top: 0, bottom: 0 },
    xAxis: { type: 'value', max: total || 1, show: false },
    yAxis: { type: 'category', data: [''], show: false },
    series: segments.map((s, i) => ({
      type: 'bar',
      name: s.label,
      stack: 'total',
      data: [s.value],
      barWidth: 16,
      itemStyle: {
        color: resolveCssColor(s.color),
        borderColor: c.card,
        borderWidth: 1,
        borderRadius:
          i === 0 ? [4, 0, 0, 4] : i === segments.length - 1 ? [0, 4, 4, 0] : 0,
      },
      animationDelay: i * 120,
    })),
  }
}

/** 12 weeks × Mon–Fri change-history heatmap on the single-hue ramp. */
export function heatmapOption(
  heat: number[][],
  weekLabels: string[],
  c: ChartTheme,
  animate: boolean,
): EChartsOption {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
  const data: [number, number, number][] = []
  let max = 0
  heat.forEach((week, w) =>
    week.forEach((v, d) => {
      data.push([w, d, v])
      if (v > max) max = v
    }),
  )
  return {
    ...baseOption(c, animate),
    tooltip: {
      ...baseOption(c, animate).tooltip,
      position: 'top',
      formatter: (p) => {
        const [w, d, v] = (p as unknown as { value: [number, number, number] }).value
        return `${days[d]}, week of ${weekLabels[w]}: <b>${v}</b> change${v === 1 ? '' : 's'}`
      },
    },
    grid: { left: 8, right: 8, top: 8, bottom: 4, containLabel: true },
    xAxis: {
      type: 'category',
      data: weekLabels,
      axisLabel: { color: c.muted, fontSize: 10, interval: 1 },
      axisLine: { show: false },
      axisTick: { show: false },
      splitArea: { show: false },
    },
    yAxis: {
      type: 'category',
      data: days,
      inverse: true,
      axisLabel: { color: c.muted, fontSize: 10 },
      axisLine: { show: false },
      axisTick: { show: false },
    },
    visualMap: {
      show: false,
      min: 0,
      max: Math.max(max, 1),
      inRange: { color: c.heat },
    },
    series: [
      {
        type: 'heatmap',
        data,
        itemStyle: { borderColor: c.card, borderWidth: 2, borderRadius: 3 },
        emphasis: { itemStyle: { borderColor: c.ink } },
      },
    ],
  }
}
