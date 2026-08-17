import { SetMetadata } from '@nestjs/common';
import { AccessLevel, AppRole, Capability } from './access.logic';

export const MIN_APP_ROLE_KEY = 'minAppRole';
export const CAPABILITY_KEY = 'capability';
export const PROJECT_PARAM_KEY = 'projectParam';
export const PROJECT_LEVEL_KEY = 'projectLevel';

/** Route requires a global role at or above `role` (admin > pmo > executive > user). */
export const MinAppRole = (role: AppRole) =>
  SetMetadata(MIN_APP_ROLE_KEY, role);

/** Shorthand for surfaces that must stay admin-only regardless of grants. */
export const AdminOnly = () => MinAppRole('admin');

/**
 * Route requires a capability from the catalog. admin always passes; other
 * roles pass when the Users & Roles grid (role_capabilities) grants it.
 */
export const RequireCapability = (capability: Capability) =>
  SetMetadata(CAPABILITY_KEY, capability);

/**
 * Marks a controller (or route) as project-scoped for ProjectAccessGuard:
 * `param` names the route param carrying the project id ('projectId' on the
 * sub-resource controllers, 'id' on projects itself).
 */
export const ProjectScoped = (param = 'projectId') =>
  SetMetadata(PROJECT_PARAM_KEY, param);

/**
 * Overrides the guard's method default (GET -> View, otherwise Write) for one
 * route — e.g. Manage on people management and weight adjustment.
 */
export const ProjectAccess = (level: AccessLevel) =>
  SetMetadata(PROJECT_LEVEL_KEY, level);
