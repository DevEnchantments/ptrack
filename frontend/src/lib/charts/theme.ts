/**
 * Chart theming helpers. ECharts draws to canvas and cannot read CSS
 * variables, so the design tokens are resolved here at render time and the
 * host re-renders when the theme toggles.
 */

export interface ChartTheme {
  /** Validated CVD-safe series order: green, orange, blue, then spares. */
  series: string[]
  /** Single-hue sequential ramp, light to dark. */
  heat: string[]
  ink: string
  muted: string
  border: string
  card: string
  popover: string
}

const VAR_RE = /^var\((--[\w-]+)\)$/

/** Resolves `var(--token)` strings to their current computed value. */
export function resolveCssColor(color: string): string {
  const m = VAR_RE.exec(color.trim())
  if (!m) return color
  return getComputedStyle(document.documentElement).getPropertyValue(m[1]).trim()
}

export function readChartTheme(): ChartTheme {
  const css = getComputedStyle(document.documentElement)
  const t = (name: string) => css.getPropertyValue(name).trim()
  return {
    series: [t('--chart-1'), t('--chart-2'), t('--chart-3'), t('--chart-4'), t('--chart-5')],
    heat: [t('--heat-1'), t('--heat-2'), t('--heat-3'), t('--heat-4'), t('--heat-5')],
    ink: t('--foreground'),
    muted: t('--muted-foreground'),
    border: t('--border'),
    card: t('--card'),
    popover: t('--popover'),
  }
}

const fmt = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 })

export const formatNumber = (v: number) => fmt.format(v)

export const withUnit = (v: number, unit?: string) =>
  unit === '%' ? `${fmt.format(v)}%` : unit ? `${unit} ${fmt.format(v)}` : fmt.format(v)

/** Compact axis labels: 1,200,000 -> 1.2M. */
export const compactNumber = (v: number) =>
  Math.abs(v) >= 1e9
    ? `${fmt.format(v / 1e9)}B`
    : Math.abs(v) >= 1e6
      ? `${fmt.format(v / 1e6)}M`
      : Math.abs(v) >= 1e3
        ? `${fmt.format(v / 1e3)}K`
        : fmt.format(v)

export const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches
