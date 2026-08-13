import { Module } from '@nestjs/common';
import { ProjectSectionsController } from './project-sections.controller';
import { ProjectSectionsService } from './project-sections.service';
import { MilestonesModule } from '../milestones/milestones.module';
import { ProgramOutcomesModule } from '../program-outcomes/program-outcomes.module';
import { ActionItemsModule } from '../action-items/action-items.module';
import { LinksModule } from '../links/links.module';
import { ResourcesModule } from '../resources/resources.module';
import { IssuesModule } from '../issues/issues.module';
import { RisksModule } from '../risks/risks.module';
import { SubmissionsModule } from '../submissions/submissions.module';
import { UpdatesModule } from '../updates/updates.module';
import { StatusReportsModule } from '../status-reports/status-reports.module';
import { AttachmentsModule } from '../attachments/attachments.module';

/**
 * Owns the section fan-out so ProjectsModule does not have to import every
 * domain module to serve one route. Nothing else consumes the service, so it
 * is not exported.
 */
@Module({
  imports: [
    MilestonesModule,
    ProgramOutcomesModule,
    ActionItemsModule,
    LinksModule,
    ResourcesModule,
    IssuesModule,
    RisksModule,
    SubmissionsModule,
    UpdatesModule,
    StatusReportsModule,
    AttachmentsModule,
  ],
  controllers: [ProjectSectionsController],
  providers: [ProjectSectionsService],
})
export class ProjectSectionsModule {}
