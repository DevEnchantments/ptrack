import { type FieldErrors } from './forms';

export interface ResourceFormValues {
  name: string;
  typeId: string | null;
  /** The dialog labels this "Notes"; the column is `description`. */
  notes: string;
}

export function resourceFormErrors(values: ResourceFormValues): FieldErrors {
  const errors: FieldErrors = {};
  if (!values.name.trim()) errors.name = 'A resource name is required.';
  if (!values.typeId) errors.typeId = 'A type is required.';
  return errors;
}

export function resourceFormPayload(values: ResourceFormValues) {
  return {
    name: values.name.trim(),
    // Non-null by the time this runs: resourceFormErrors rejects a missing
    // type before the dialog submits.
    type_id: values.typeId as string,
    description: values.notes.trim() || undefined,
  };
}
