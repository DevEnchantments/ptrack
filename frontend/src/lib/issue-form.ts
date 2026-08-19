import { parseTags, type FieldErrors } from './forms';

export interface IssueFormValues {
  title: string;
  roleId: string | null;
  ownerId: string | null;
  status: string;
  levelId: string | null;
  categoryId: string | null;
  description: string;
  url: string;
  referenceId: string;
  /** Raw comma-separated field, exactly as typed. */
  tags: string;
  resolution: string;
  recommendation: string;
  reportedBy: string;
  dateClosed: string;
}

/** Closing an issue without saying how it was resolved leaves no record. */
export function issueFormErrors(values: IssueFormValues): FieldErrors {
  const errors: FieldErrors = {};
  if (!values.title.trim()) errors.title = 'An issue title is required.';
  if (values.status === 'closed' && !values.resolution.trim()) {
    errors.resolution =
      'Resolution / Mitigation is required when the issue is closed.';
  }
  return errors;
}

/**
 * The resolution is deliberately dropped unless the issue is closed: a
 * resolution typed and then reopened would otherwise linger on a live issue,
 * describing an ending that did not happen.
 */
export function issueFormPayload(values: IssueFormValues) {
  const tags = parseTags(values.tags);
  return {
    title: values.title.trim(),
    role_id: values.roleId,
    owner_id: values.ownerId,
    status: values.status,
    level_id: values.levelId,
    category_id: values.categoryId,
    description: values.description.trim() || null,
    url: values.url.trim() || null,
    reference_identifier: values.referenceId.trim() || null,
    tags: tags.length ? tags : null,
    resolution: values.status === 'closed' ? values.resolution.trim() : null,
    recommendation: values.recommendation.trim() || null,
    reported_by: values.reportedBy.trim() || null,
    date_closed: values.dateClosed || null,
  };
}
