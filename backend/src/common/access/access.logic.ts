/**
 * Pure authorization logic (FR-15; model in docs/FDD-ALIGNMENT.md section 8).
 * Kept side-effect-free for unit testing — the services feed it data, the
 * guards act on its answers.
 */

export const APP_ROLES = ['user', 'executive', 'pmo', 'admin'] as const;
/** Roles whose capability grants are editable — admin bypasses everything. */
export const GRANTABLE_ROLES = ['pmo', 'executive', 'user'] as const;
export type GrantableRole = (typeof GRANTABLE_ROLES)[number];

/**
 * The capability CATALOG is code: every key maps to guarded routes, so a key
 * cannot be invented from the UI. Which role HOLDS a key is data
 * (role_capabilities, db/role_capabilities.sql) edited in Users & Roles.
 */
export const CAPABILITIES = [
  {
    key: 'projects.create',
    label: 'Create projects',
    description: 'New Project wizard and From Template (FDD 3.1 step 1).',
  },
  {
    key: 'cycles.close',
    label: 'Close / reopen reporting cycles',
    description: 'Lock or unlock the current cycle (FDD 3.1 step 8).',
  },
  {
    key: 'kpis.manage',
    label: 'Manage KPIs',
    description: 'Create/edit/delete KPI definitions, readings, action plans.',
  },
  {
    key: 'templates.instantiate',
    label: 'Create projects from templates',
    description: 'Instantiate a saved template into a new project.',
  },
  {
    key: 'lookups.manage',
    label: 'Manage code tables',
    description: 'Add, rename, reorder and deactivate lookup values.',
  },
  {
    key: 'import.run',
    label: 'Run CSV imports',
    description: 'Bulk-load projects and milestones from CSV.',
  },
  {
    key: 'users.provision',
    label: 'Provision accounts',
    description: 'Create login accounts for pending people.',
  },
  {
    key: 'users.manage_roles',
    label: 'Manage roles & permissions',
    description: 'Assign global roles and edit this permissions grid.',
  },
] as const;
export type Capability = (typeof CAPABILITIES)[number]['key'];

export const CAPABILITY_KEYS = CAPABILITIES.map((c) => c.key);

export function isCapability(value: unknown): value is Capability {
  return CAPABILITY_KEYS.includes(value as Capability);
}

/**
 * Seed defaults — the enforcement that shipped 2026-08-17, mirrored in
 * db/role_capabilities.sql. Also the FAIL-SAFE: when the table is unreadable
 * (migration not run), grants resolve to exactly this.
 */
export const DEFAULT_GRANTS: Record<GrantableRole, readonly Capability[]> = {
  pmo: [
    'projects.create',
    'cycles.close',
    'kpis.manage',
    'templates.instantiate',
  ],
  executive: [],
  user: [],
};

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
