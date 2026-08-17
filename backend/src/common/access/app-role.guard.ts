import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AppRoleService } from './app-role.service';
import { atLeastRole, AppRole } from './access.logic';
import { MIN_APP_ROLE_KEY } from './access.decorators';
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
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const min = this.reflector.getAllAndOverride<AppRole | undefined>(
      MIN_APP_ROLE_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!min) return true;

    const request = context.switchToHttp().getRequest<{ user?: AuthUser }>();
    if (!request.user) return true; // @Public route — nothing to enforce.

    const role = await this.roles.getRole(request.user.id);
    if (!atLeastRole(role, min)) {
      throw new ForbiddenException(`This action needs the ${min} role.`);
    }
    return true;
  }
}
