import { parseTags, type FieldErrors } from './forms';

export interface UpdateFormValues {
  body: string;
  typeId: string | null;
  isGold: boolean;
  /** Raw comma-separated field, exactly as typed. */
  tags: string;
}

export function updateFormErrors(values: UpdateFormValues): FieldErrors {
  const errors: FieldErrors = {};
  if (!values.body.trim()) errors.body = 'An update is required.';
  return errors;
}

/**
 * NOTE `null` rather than `undefined` for empty tags, unlike the link and
 * milestone dialogs. Both reach the same backend, which treats an absent key
 * as "leave it alone" and null as "clear it" — so this dialog clears tags on
 * edit where those two leave them. Pinned as-is; harmonising is an
 * API-behaviour decision, not a refactor (FOLLOW-UPS F4 territory).
 */
export function updateFormPayload(values: UpdateFormValues) {
  const tags = parseTags(values.tags);
  return {
    body: values.body.trim(),
    type_id: values.typeId,
    is_gold: values.isGold,
    tags: tags.length ? tags : null,
  };
}
