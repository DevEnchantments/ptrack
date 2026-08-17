import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ProjectAccessService } from './project-access.service';
import { AccessLevel, defaultLevelFor } from './access.logic';
import { PROJECT_LEVEL_KEY, PROJECT_PARAM_KEY } from './access.decorators';
import type { AuthUser } from '../decorators/current-user.decorator';

const LEVEL_LABEL: Record<AccessLevel, string> = {
  [AccessLevel.None]: 'no',
  [AccessLevel.View]: 'view',
  [AccessLevel.Write]: 'write',
  [AccessLevel.Manage]: 'manage',
};

/**
 * Global guard for project-scoped routes (FR-15). Activates only where
 * @ProjectScoped names the id param; the required level is the method default
 * (GET -> View, otherwise Write) unless @ProjectAccess overrides it.
 * A restricted project the caller cannot view 404s inside levelFor, so its
 * existence does not leak; an insufficient level on a visible project 403s.
 */
@Injectable()
export class ProjectAccessGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly access: ProjectAccessService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const param = this.reflector.getAllAndOverride<string | undefined>(
      PROJECT_PARAM_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!param) return true;

    const request = context.switchToHttp().getRequest<{
      user?: AuthUser;
      params: Record<string, string>;
      method: string;
    }>();
    const projectId = request.params[param];
    // Routes on the same controller without the param (e.g. GET /projects)
    // are not project-scoped — list filtering handles them.
    if (!projectId || !request.user) return true;

    const required =
      this.reflector.getAllAndOverride<AccessLevel | undefined>(
        PROJECT_LEVEL_KEY,
        [context.getHandler(), context.getClass()],
      ) ?? defaultLevelFor(request.method);

    const level = await this.access.levelFor(request.user.id, projectId);
    if (level < required) {
      // No relationship at all -> the project must not leak its existence:
      // answer exactly like a project that isn't there.
      if (level === AccessLevel.None) {
        throw new NotFoundException('Project not found.');
      }
      throw new ForbiddenException(
        `You need ${LEVEL_LABEL[required]} access on this project.`,
      );
    }
    return true;
  }
}
