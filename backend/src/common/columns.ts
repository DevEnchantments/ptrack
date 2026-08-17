/**
 * Declarative DTO → column mapping for module write paths.
 *
 * Every module was open-coding the same block: one `if (dto.x !== undefined)`
 * per field, each restating how that field normalizes, once in `add` and again
 * in `update`. Two copies per module meant create and update could silently
 * drift apart on trimming or null-collapsing. Here the rules live once and each
 * module declares only which fields follow which rule.
 *
 * Only keys actually present on the DTO appear in the result, so the same
 * function serves create (spread over the module's defaults) and patch
 * (spread onto `updated_by`).
 */
export interface ColumnSpec {
  /** Trimmed, never nulled — a required text column. */
  trimmed?: readonly string[];
  /** Trimmed, and a blank string clears the column. */
  trimmedOrNull?: readonly string[];
  /**
   * An explicit null clears the column. `?? null`, never `|| null`: on the
   * numeric ones a zero is a value, not a blank.
   */
  nullable?: readonly string[];
  /** Dates, where an empty string clears the column. */
  dateOrNull?: readonly string[];
  /** Arrays, where an empty array clears the column. */
  arrayOrNull?: readonly string[];
  /** Written exactly as received (enums, booleans, already-validated scalars). */
  asIs?: readonly string[];
}

export function columnsFrom(
  dto: object,
  spec: ColumnSpec,
): Record<string, unknown> {
  const sent = dto as Record<string, unknown>;
  const cols: Record<string, unknown> = {};

  const take = (
    keys: readonly string[] | undefined,
    normalize: (value: unknown) => unknown,
  ) => {
    for (const key of keys ?? []) {
      if (sent[key] !== undefined) cols[key] = normalize(sent[key]);
    }
  };

  take(spec.trimmed, (v) => (v as string).trim());
  take(spec.trimmedOrNull, (v) => (v as string | null)?.trim() || null);
  take(spec.nullable, (v) => v ?? null);
  take(spec.dateOrNull, (v) => v || null);
  take(spec.arrayOrNull, (v) => ((v as unknown[] | null)?.length ? v : null));
  take(spec.asIs, (v) => v);

  return cols;
}
