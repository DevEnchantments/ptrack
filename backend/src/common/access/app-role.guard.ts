import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AppRoleService } from './app-role.service';
import { CapabilityService } from './capability.service';
import { atLeastRole, AppRole, Capability, CAPABILITIES } from './access.logic';
import { CAPABILITY_KEY, MIN_APP_ROLE_KEY } from './access.decorators';
import type { AuthUser } from '../decorators/current-user.decorator';

/**
 * Global guard enforcing @MinAppRole/@AdminOnly. Runs after SupabaseAuthGuard
 * (registration order), so request.user is present on non-public routes.
 * Routes without the metadata pass untouched.
 */
@Injectable()
export class AppRoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly roles: AppRoleService,
    private readonly capabilities: CapabilityService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const min = this.reflector.getAllAndOverride<AppRole | undefined>(
      MIN_APP_ROLE_KEY,
      [context.getHandler(), context.getClass()],
    );
    const capability = this.reflector.getAllAndOverride<Capability | undefined>(
      CAPABILITY_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!min && !capability) return true;

    const request = context.switchToHttp().getRequest<{ user?: AuthUser }>();
    if (!request.user) return true; // @Public route — nothing to enforce.

    if (min) {
      const role = await this.roles.getRole(request.user.id);
      if (!atLeastRole(role, min)) {
        throw new ForbiddenException(`This action needs the ${min} role.`);
      }
    }
    if (capability) {
      const allowed = await this.capabilities.has(request.user.id, capability);
      if (!allowed) {
        const label =
          CAPABILITIES.find((c) => c.key === capability)?.label ?? capability;
        throw new ForbiddenException(`Your role is not granted "${label}".`);
      }
    }
    return true;
  }
}
