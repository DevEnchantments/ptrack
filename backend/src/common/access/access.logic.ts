/**
 * Pure authorization logic (FR-15; model in docs/FDD-ALIGNMENT.md section 8).
 * Kept side-effect-free for unit testing — the services feed it data, the
 * guards act on its answers.
 */

export const APP_ROLES = ['user', 'executive', 'pmo', 'admin'] as const;
export type AppRole = (typeof APP_ROLES)[number];

/** Ordered project access: each level includes everything below it. */
export enum AccessLevel {
  None = 0,
  View = 1,
  Write = 2,
  Manage = 3,
}

export function isAppRole(value: unknown): value is AppRole {
  return APP_ROLES.includes(value as AppRole);
}

/** True when `role` sits at or above `min` (admin > pmo > executive > user). */
export function atLeastRole(role: AppRole, min: AppRole): boolean {
  return APP_ROLES.indexOf(role) >= APP_ROLES.indexOf(min);
}

const MEMBERSHIP_LEVEL: Record<string, AccessLevel> = {
  read_only: AccessLevel.View,
  read_write: AccessLevel.Write,
  read_write_admin: AccessLevel.Manage,
};

export interface ProjectAccessInput {
  appRole: AppRole;
  userId: string;
  /** projects.access_control — anything but 'restricted' is open. */
  accessControl: string;
  ownerId: string | null;
  projectManagerId: string | null;
  projectManager2Id: string | null;
  pmoPartnerId: string | null;
  /** The user's active membership access_level, if any. */
  membershipLevel: string | null;
}

/**
 * Effective level = max(global role, project relationship, membership tier).
 * Owner manages; PMs and the PMO Partner write; open projects are viewable by
 * anyone signed in; restricted projects grant nothing without a relationship.
 * Executives view open projects (restricted drill-down ASSUMED closed — OI).
 */
export function resolveProjectLevel(input: ProjectAccessInput): AccessLevel {
  if (atLeastRole(input.appRole, 'pmo')) return AccessLevel.Manage;

  let level = AccessLevel.None;
  if (input.accessControl !== 'restricted') level = AccessLevel.View;

  if (input.membershipLevel) {
    level = Math.max(
      level,
      MEMBERSHIP_LEVEL[input.membershipLevel] ?? AccessLevel.View,
    );
  }
  if (input.userId === input.projectManagerId)
    level = Math.max(level, AccessLevel.Write);
  if (input.userId === input.projectManager2Id)
    level = Math.max(level, AccessLevel.Write);
  if (input.userId === input.pmoPartnerId)
    level = Math.max(level, AccessLevel.Write);
  if (input.userId === input.ownerId) level = AccessLevel.Manage;

  return level;
}

/** The level a route needs when it carries no explicit override. */
export function defaultLevelFor(method: string): AccessLevel {
  return method === 'GET' ? AccessLevel.View : AccessLevel.Write;
}
