/**
 * Pieces every Add/Edit dialog needs.
 *
 * Each dialog's own rules live in its `<entity>-form.ts`; only what is
 * genuinely identical across all of them belongs here. They live in lib/
 * rather than beside the components because a file exporting a React component
 * must export only components (react-refresh).
 */

/** Field name -> message, for the inline error under each input. */
export type FieldErrors = Record<string, string>;

/**
 * A comma-separated field as a list, ignoring blanks and stray spaces.
 *
 * Every dialog with a tags input repeated this. It is one rule — "commas
 * separate, spaces do not count, empties are dropped" — and a user typing
 * `migration, , q3,` should get two tags from any of them.
 */
export function parseTags(raw: string): string[] {
  return raw
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);
}
