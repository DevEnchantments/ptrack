/**
 * The FR-14 submission workflow, as data.
 *
 * Every verb used to spell out its own five options at the call site, so
 * learning the state machine meant reading four methods and assembling it
 * mentally. Here one row is the complete definition of a verb: which statuses
 * it accepts, what it produces, who may perform it, which columns it stamps,
 * and who hears about it.
 *
 * Routing is ASSUMED per Fig 10 (see FDD-ALIGNMENT 1.6).
 */

export interface NotificationContext {
  /** Falls back to "A project" when the project row could not be read. */
  projectName: string;
  /** Falls back to "this cycle" when the submission has no cycle joined. */
  cycleName: string;
  /** Who submitted it: the recipient for approve, return and reject. */
  submittedBy: string | null | undefined;
  /** The project's owner: the recipient for validate. */
  ownerId: string | null | undefined;
  /** The decision comment, already trimmed of surrounding space. */
  comment: string | null;
}

export interface WorkflowNotification {
  userId: string | null | undefined;
  type: string;
  title: string;
  body: string;
}

export interface TransitionSpec {
  /** Statuses this verb may be applied to. */
  from: string[];
  /** The status it produces. */
  to: string;
  /**
   * The `<stamp>_by` / `<stamp>_at` columns it writes. Every outcome has its
   * own pair since db/submission_rejection_columns.sql (FOLLOW-UPS F3); reject
   * previously borrowed `returned_*`, which made the two indistinguishable in
   * the audit trail.
   */
  stamp: 'validated' | 'approved' | 'returned' | 'rejected';
  /**
   * The project column naming the only user allowed to perform it. Enforced
   * only when that column is set: a project with no PMO Partner can be
   * validated by anyone.
   */
  actor?: { field: 'pmo_partner_id' | 'owner_id'; label: string };
  notify: (ctx: NotificationContext) => WorkflowNotification;
}

export const TRANSITIONS = {
  validate: {
    from: ['review'],
    to: 'validated',
    stamp: 'validated',
    actor: { field: 'pmo_partner_id', label: 'PMO Partner' },
    notify: (ctx) => ({
      userId: ctx.ownerId,
      type: 'submission_validated',
      title: `${ctx.projectName} awaits approval`,
      body: `The ${ctx.cycleName} submission was validated.`,
    }),
  },
  approve: {
    from: ['validated'],
    to: 'approved',
    stamp: 'approved',
    actor: { field: 'owner_id', label: 'Project Owner' },
    notify: (ctx) => ({
      userId: ctx.submittedBy,
      type: 'submission_approved',
      title: `${ctx.projectName}: submission approved`,
      body: `Your ${ctx.cycleName} submission was approved.`,
    }),
  },
  return: {
    from: ['review', 'validated'],
    to: 'returned',
    stamp: 'returned',
    notify: (ctx) => ({
      userId: ctx.submittedBy,
      type: 'submission_returned',
      title: `${ctx.projectName}: submission returned`,
      body: ctx.comment || `Your ${ctx.cycleName} submission was returned.`,
    }),
  },
  reject: {
    from: ['review', 'validated'],
    to: 'rejected',
    stamp: 'rejected',
    notify: (ctx) => ({
      userId: ctx.submittedBy,
      type: 'submission_rejected',
      title: `${ctx.projectName}: submission rejected`,
      body: ctx.comment || `Your ${ctx.cycleName} submission was rejected.`,
    }),
  },
} satisfies Record<string, TransitionSpec>;

export type TransitionName = keyof typeof TRANSITIONS;
