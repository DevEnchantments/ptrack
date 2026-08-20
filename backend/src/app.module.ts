import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { DatabaseModule } from './database/database.module';
import { AccessModule } from './common/access/access.module';
import { AccessAdminModule } from './modules/access-admin/access-admin.module';
import { SupabaseAuthGuard } from './common/guards/supabase-auth.guard';
import { AppRoleGuard } from './common/access/app-role.guard';
import { ProjectAccessGuard } from './common/access/project-access.guard';
import { ProjectsModule } from './modules/projects/projects.module';
import { ProjectSectionsModule } from './modules/project-sections/project-sections.module';
import { UsersModule } from './modules/users/users.module';
import { LookupsModule } from './modules/lookups/lookups.module';
import { PeopleModule } from './modules/people/people.module';
import { MilestonesModule } from './modules/milestones/milestones.module';
import { ProgramOutcomesModule } from './modules/program-outcomes/program-outcomes.module';
import { ActionItemsModule } from './modules/action-items/action-items.module';
import { LinksModule } from './modules/links/links.module';
import { ResourcesModule } from './modules/resources/resources.module';
import { IssuesModule } from './modules/issues/issues.module';
import { RisksModule } from './modules/risks/risks.module';
import { SubmissionsModule } from './modules/submissions/submissions.module';
import { ScheduleModule } from '@nestjs/schedule';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { SearchModule } from './modules/search/search.module';
import { RegistryModule } from './modules/registry/registry.module';
import { ImportModule } from './modules/import/import.module';
import { TemplatesModule } from './modules/templates/templates.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { ReportsModule } from './modules/reports/reports.module';
import { KpisModule } from './modules/kpis/kpis.module';
import { UpdatesModule } from './modules/updates/updates.module';
import { StatusReportsModule } from './modules/status-reports/status-reports.module';
import { AttachmentsModule } from './modules/attachments/attachments.module';
import { AssistantModule } from './modules/assistant/assistant.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AccessModule,
    AccessAdminModule,
    ProjectsModule,
    ProjectSectionsModule,
    UsersModule,
    LookupsModule,
    PeopleModule,
    MilestonesModule,
    ProgramOutcomesModule,
    ActionItemsModule,
    LinksModule,
    ResourcesModule,
    IssuesModule,
    RisksModule,
    SubmissionsModule,
    ScheduleModule.forRoot(),
    NotificationsModule,
    SearchModule,
    RegistryModule,
    ImportModule,
    TemplatesModule,
    DashboardModule,
    ReportsModule,
    KpisModule,
    UpdatesModule,
    StatusReportsModule,
    AttachmentsModule,
    AssistantModule,
  ],
  controllers: [AppController],

  // Guard order is load-bearing: authentication must attach request.user
  // BEFORE the authorization guards read it. All three registered here, in
  // this order, for that reason — never move the access guards back into
  // AccessModule (imported-module guards run first and bypass authorization).
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: SupabaseAuthGuard },
    { provide: APP_GUARD, useClass: AppRoleGuard },
    { provide: APP_GUARD, useClass: ProjectAccessGuard },
  ],
})
export class AppModule {}
