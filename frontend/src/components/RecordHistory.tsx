import { useEffect, useState } from 'react'
import type { HistoryEntry } from '@/lib/api'

interface Props {
  /** Resolves to the record's history, newest first. */
  load: () => Promise<HistoryEntry[]>
  /** Refetch when this changes (e.g. after an edit). */
  refreshKey?: unknown
  /** Shown on 'created' entries, e.g. "milestone". */
  recordNoun: string
}

function relativeTime(iso: string): string {
  const sec = Math.round((Date.now() - new Date(iso).getTime()) / 1000)
  if (sec < 60) return 'just now'
  const min = Math.round(sec / 60)
  if (min < 60) return `${min} minute${min === 1 ? '' : 's'} ago`
  const hr = Math.round(min / 60)
  if (hr < 24) return `${hr} hour${hr === 1 ? '' : 's'} ago`
  const day = Math.round(hr / 24)
  if (day < 30) return `${day} day${day === 1 ? '' : 's'} ago`
  const mo = Math.round(day / 30)
  if (mo < 12) return `${mo} month${mo === 1 ? '' : 's'} ago`
  const yr = Math.round(mo / 12)
  return `${yr} year${yr === 1 ? '' : 's'} ago`
}

/** The original shows the email local-part (e.g. "fares.alareefi"), not the full name. */
function username(actor: HistoryEntry['actor']): string {
  if (!actor) return 'Unknown'
  if (actor.email) return actor.email.split('@')[0]
  return actor.full_name ?? 'Unknown'
}

function initials(actor: HistoryEntry['actor']): string {
  const source = actor?.full_name || actor?.email || '?'
  return source
    .replace(/@.*$/, '')
    .split(/[.\s_-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join('')
}

export function RecordHistory({ load, refreshKey, recordNoun }: Props) {
  const [entries, setEntries] = useState<HistoryEntry[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    load()
      .then((rows) => {
        if (cancelled) return
        setEntries(rows)
        setError(null)
      })
      .catch((e: Error) => {
        if (!cancelled) setError(e.message)
      })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey])

  if (error) {
    return (
      <div className="rounded-md border p-6 text-sm text-destructive">
        Could not load history: {error}
      </div>
    )
  }

  if (entries === null) {
    return (
      <div className="rounded-md border p-6 text-sm text-muted-foreground">
        Loading history…
      </div>
    )
  }

  if (entries.length === 0) {
    return (
      <div className="rounded-md border p-6 text-sm text-muted-foreground">
        No history recorded yet.
      </div>
    )
  }

  return (
    <ul className="flex flex-col gap-4 rounded-md border p-6">
      {entries.map((e) => (
        <li key={e.id} className="flex gap-3">
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
            {initials(e.actor)}
          </span>
          <div className="min-w-0">
            <div className="text-xs text-muted-foreground">
              {username(e.actor)} · {relativeTime(e.changed_at)}
            </div>
            <div className="text-sm">
              {e.event === 'created' ? (
                <span className="text-muted-foreground">
                  Created this {recordNoun}.
                </span>
              ) : (
                <>
                  <span className="font-medium">{e.field_label}</span> changed
                  from <Value text={e.old_value} /> to{' '}
                  <Value text={e.new_value} />
                </>
              )}
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}

/** Values are quoted, and an empty value renders as "" — matching the original. */
function Value({ text }: { text: string | null }) {
  return <span className="break-words">&quot;{text ?? ''}&quot;</span>
}
