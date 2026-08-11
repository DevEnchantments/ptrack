/**
 * Pure resolution helpers for the CSV import (kept side-effect-free for unit
 * testing). The server is the authority: the client preview mirrors these
 * rules, but everything is re-checked here.
 */

/** Distinct sentinel so `string` unions stay honest for the linter. */
export const INVALID: unique symbol = Symbol('invalid');
export type Invalid = typeof INVALID;

export interface LookupOption {
  id: string;
  name: string;
}

/** Case-insensitive, trimmed lookup-name match. Empty input = no value. */
export function resolveLookup(
  value: string | undefined,
  options: LookupOption[],
): { id: string | null; unmatched: string | null } {
  const clean = (value ?? '').trim();
  if (!clean) return { id: null, unmatched: null };
  const hit = options.find(
    (o) => o.name.trim().toLowerCase() === clean.toLowerCase(),
  );
  return hit ? { id: hit.id, unmatched: null } : { id: null, unmatched: clean };
}

/** Accepts `yyyy-mm-dd` or `dd/mm/yyyy`; returns ISO, null (empty), or 'invalid'. */
export function parseDateValue(
  value: string | undefined,
): string | null | Invalid {
  const clean = (value ?? '').trim();
  if (!clean) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(clean)) {
    return Number.isNaN(Date.parse(clean)) ? INVALID : clean;
  }
  const dmy = clean.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (dmy) {
    const iso = `${dmy[3]}-${dmy[2].padStart(2, '0')}-${dmy[1].padStart(2, '0')}`;
    return Number.isNaN(Date.parse(iso)) ? INVALID : iso;
  }
  return INVALID;
}

/** Numeric field: strips thousands separators/currency-ish noise. */
export function parseNumberValue(
  value: string | undefined,
): number | null | Invalid {
  const clean = (value ?? '').trim().replace(/[, ]/g, '');
  if (!clean) return null;
  const n = Number(clean);
  return Number.isFinite(n) ? n : INVALID;
}

export function parseBoolValue(value: string | undefined): boolean {
  return ['yes', 'y', 'true', '1', 'x'].includes(
    (value ?? '').trim().toLowerCase(),
  );
}

const MILESTONE_STATUS: Record<string, string> = {
  open: 'open',
  'in progress': 'open',
  closed: 'closed_completed',
  completed: 'closed_completed',
  complete: 'closed_completed',
  done: 'closed_completed',
  'closed / completed': 'closed_completed',
  'n/a': 'not_applicable',
  'not applicable': 'not_applicable',
};

/** Maps friendly status words to the milestone status enum; default open. */
export function parseMilestoneStatus(value: string | undefined): string {
  return MILESTONE_STATUS[(value ?? '').trim().toLowerCase()] ?? 'open';
}
