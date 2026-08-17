/**
 * Shared display formatters.
 *
 * The house absolute-date format is `07-JUL-2026`, matching what the
 * `record_history` trigger writes at capture time (see CLAUDE.md), so a date
 * rendered here reads identically to the same date in a History tab.
 */

/**
 * `07-JUL-2026`.
 *
 * Accepts both date-only strings (`2026-07-07`, as stored on `due_date` /
 * `report_date` / `start_date`) and full timestamps (`created_at`). Date-only
 * values are pinned to local midnight first: parsing a bare `YYYY-MM-DD` is
 * UTC per spec, which renders as the previous day west of Greenwich.
 * Unparseable input is returned untouched rather than shown as "Invalid Date".
 */
export function formatDate(iso: string): string {
  if (!iso) return ''
  const d = new Date(iso.length === 10 ? `${iso}T00:00:00` : iso)
  if (isNaN(d.getTime())) return iso
  const day = String(d.getDate()).padStart(2, '0')
  const mon = d.toLocaleString('en-US', { month: 'short' }).toUpperCase()
  return `${day}-${mon}-${d.getFullYear()}`
}

/**
 * Coarse "3 days ago" phrasing for activity metadata.
 *
 * Under a minute reads "just now". Three of the five copies this replaced
 * already did that; the other two counted seconds, and Fares' call was to
 * unify on "just now" everywhere (2026-08-13).
 */
export function relativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime()
  const sec = Math.round(diffMs / 1000)
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

/** Anything carrying a person's display fields — profile, author, owner, actor. */
export interface PersonLike {
  full_name?: string | null
  email?: string | null
}

/**
 * The house rule for showing a person: full name, else email, else a fallback.
 * It was open-coded at 30+ call sites with three different fallbacks, so the
 * fallback is the parameter and the rule lives here.
 *
 * Note this is `||`, not `??`: a blank full_name falls through to the email.
 */
export function personName(person: PersonLike | null | undefined): string
export function personName(
  person: PersonLike | null | undefined,
  fallback: string,
): string
export function personName(
  person: PersonLike | null | undefined,
  fallback: null,
): string | null
export function personName(
  person: PersonLike | null | undefined,
  fallback: string | null = 'Unknown',
): string | null {
  return person?.full_name || person?.email || fallback
}

/** Up to two uppercase letters for avatar glyphs. */
export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[1][0]).toUpperCase()
}
