/** Pure day-offset math for template scheduling (unit-tested). Milestone and
 *  outcome dates are stored as offsets from the source project's start date,
 *  so instantiating with a new start date shifts the whole schedule. */

const DAY = 86_400_000;

/** Days from base to date; null when either side is missing. */
export function dayOffset(
  dateIso: string | null | undefined,
  baseIso: string | null | undefined,
): number | null {
  if (!dateIso || !baseIso) return null;
  const date = Date.parse(`${dateIso}T00:00:00Z`);
  const base = Date.parse(`${baseIso}T00:00:00Z`);
  if (Number.isNaN(date) || Number.isNaN(base)) return null;
  return Math.round((date - base) / DAY);
}

/** base + offset days as ISO; null when either side is missing. */
export function materializeOffset(
  baseIso: string | null | undefined,
  offset: number | null | undefined,
): string | null {
  if (!baseIso || offset == null) return null;
  const base = Date.parse(`${baseIso}T00:00:00Z`);
  if (Number.isNaN(base)) return null;
  const d = new Date(base + offset * DAY);
  return d.toISOString().slice(0, 10);
}
