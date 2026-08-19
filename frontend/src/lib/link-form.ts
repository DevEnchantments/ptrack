import { parseTags, type FieldErrors } from './forms';

/** Links must be absolute: a bare "intranet/page" would resolve nowhere. */
const URL_PATTERN = /^https?:\/\//;

export interface LinkFormValues {
  url: string;
  label: string;
  description: string;
  isGold: boolean;
  /** Raw comma-separated field, exactly as typed. */
  tags: string;
}

/**
 * NOTE the overwrite: a blank URL fails both checks, and the pattern message
 * lands second, so the user is told "must start with http://" rather than
 * "required". Pinned as current behaviour rather than quietly corrected —
 * changing it changes what a user sees.
 */
export function linkFormErrors(values: LinkFormValues): FieldErrors {
  const errors: FieldErrors = {};
  const url = values.url.trim();
  if (!url) errors.url = 'A URL is required.';
  if (!URL_PATTERN.test(url))
    errors.url = 'URL must start with http:// or https://';
  return errors;
}

export function linkFormPayload(values: LinkFormValues) {
  const tags = parseTags(values.tags);
  return {
    url: values.url.trim(),
    label: values.label.trim() || undefined,
    description: values.description.trim() || undefined,
    is_gold: values.isGold,
    tags: tags.length ? tags : undefined,
  };
}
