import { SetMetadata } from '@nestjs/common';
import { AccessLevel, AppRole } from './access.logic';

export const MIN_APP_ROLE_KEY = 'minAppRole';
export const PROJECT_PARAM_KEY = 'projectParam';
export const PROJECT_LEVEL_KEY = 'projectLevel';

/** Route requires a global role at or above `role` (admin > pmo > executive > user). */
export const MinAppRole = (role: AppRole) =>
  SetMetadata(MIN_APP_ROLE_KEY, role);

/** Shorthand for the admin-only surfaces (Code Tables, Import, provisioning). */
export const AdminOnly = () => MinAppRole('admin');

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
