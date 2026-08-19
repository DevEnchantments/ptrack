/**
 * Supabase Storage bucket names.
 *
 * The attachments bucket lives here rather than inside the attachments module
 * because two modules write to it: `attachments` owns the lifecycle of an
 * individual file, and `projects` clears the whole prefix when a project is
 * deleted. A bucket name both depend on is shared infrastructure, not either
 * module's policy, so neither should have to import the other to learn it.
 */
export const ATTACHMENTS_BUCKET = 'project-attachments';
