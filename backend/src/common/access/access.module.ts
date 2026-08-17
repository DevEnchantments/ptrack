import { Global, Module } from '@nestjs/common';
import { AppRoleService } from './app-role.service';
import { ProjectAccessService } from './project-access.service';
import { CapabilityService } from './capability.service';
import { AppRoleGuard } from './app-role.guard';
import { ProjectAccessGuard } from './project-access.guard';

/**
 * FR-15 authorization (model: docs/FDD-ALIGNMENT.md section 8). Global so
 * controllers can use the decorators and services without imports; the two
 * guards register globally and no-op on routes without their metadata.
 * Guard order: SupabaseAuthGuard (app.module) runs first, then these.
 */
@Global()
@Module({
  // The guards are NOT registered here. APP_GUARDs from imported modules run
  // BEFORE the root module's, which would put authorization ahead of
  // authentication (no request.user yet -> silent bypass). app.module.ts
  // registers all three in explicit order: auth, then role, then project.
  providers: [
    AppRoleService,
    CapabilityService,
    ProjectAccessService,
    AppRoleGuard,
    ProjectAccessGuard,
  ],
  exports: [
    AppRoleService,
    CapabilityService,
    ProjectAccessService,
    AppRoleGuard,
    ProjectAccessGuard,
  ],
})
export class AccessModule {}
