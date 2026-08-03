/** Minimal CSV builder + download trigger (UC-03 Excel export, no deps). */

function escapeCell(value: unknown): string {
  if (value == null) return ''
  const text = String(value)
  if (/[",\n\r]/.test(text)) return `"${text.replace(/"/g, '""')}"`
  return text
}

export function buildCsv(
  headers: string[],
  rows: Array<Array<unknown>>,
): string {
  const lines = [headers, ...rows].map((row) => row.map(escapeCell).join(','))
  // BOM so Excel opens UTF-8 correctly.
  return '﻿' + lines.join('\r\n')
}

export function downloadCsv(filename: string, csv: string): void {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
