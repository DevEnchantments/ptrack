import { useEffect, useRef } from 'react'
import * as echarts from 'echarts/core'
import {
  BarChart,
  CustomChart,
  HeatmapChart,
  LineChart,
  PieChart,
} from 'echarts/charts'
import {
  AriaComponent,
  GraphicComponent,
  GridComponent,
  LegendComponent,
  TooltipComponent,
  VisualMapComponent,
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import type { EChartsOption } from 'echarts'
import { prefersReducedMotion, readChartTheme, type ChartTheme } from '@/lib/charts/theme'

echarts.use([
  BarChart,
  LineChart,
  PieChart,
  CustomChart,
  HeatmapChart,
  GridComponent,
  LegendComponent,
  TooltipComponent,
  VisualMapComponent,
  GraphicComponent,
  AriaComponent,
  CanvasRenderer,
])

export interface EChartHostProps {
  /** Builds the option from the current theme; re-run when the theme flips. */
  build: (theme: ChartTheme, animate: boolean) => EChartsOption
  height: number
  className?: string
}

/**
 * The single ECharts integration in the app. Lazy-loaded by `EChart`, so the
 * library only ships to pages that actually draw a chart.
 */
export default function EChartHost({ build, height, className }: EChartHostProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const chart = echarts.init(el, undefined, { renderer: 'canvas' })
    const animate = !prefersReducedMotion()
    const render = () =>
      chart.setOption(
        { aria: { enabled: true }, ...build(readChartTheme(), animate) },
        true,
      )
    render()

    // Re-theme when AppLayout toggles the .dark class on <html>.
    const observer = new MutationObserver(render)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    const resize = new ResizeObserver(() => chart.resize())
    resize.observe(el)
    return () => {
      observer.disconnect()
      resize.disconnect()
      chart.dispose()
    }
  }, [build])

  return <div ref={ref} style={{ height }} className={className ?? 'w-full'} />
}
