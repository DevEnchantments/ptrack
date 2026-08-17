import { Global, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppRoleService } from './app-role.service';
import { ProjectAccessService } from './project-access.service';
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
  providers: [
    AppRoleService,
    ProjectAccessService,
    { provide: APP_GUARD, useClass: AppRoleGuard },
    { provide: APP_GUARD, useClass: ProjectAccessGuard },
  ],
  exports: [AppRoleService, ProjectAccessService],
})
export class AccessModule {}
