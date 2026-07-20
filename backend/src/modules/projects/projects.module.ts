import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { ProjectsRepository } from './projects.repository';
import { MilestonesModule } from '../milestones/milestones.module';
import { ActionItemsModule } from '../action-items/action-items.module';
import { LinksModule } from '../links/links.module';
import { ResourcesModule } from '../resources/resources.module';
import { IssuesModule } from '../issues/issues.module';
import { UpdatesModule } from '../updates/updates.module';
import { StatusReportsModule } from '../status-reports/status-reports.module';
import { AttachmentsModule } from '../attachments/attachments.module';

@Module({
  imports: [
    MilestonesModule,
    ActionItemsModule,
    LinksModule,
    ResourcesModule,
    IssuesModule,
    UpdatesModule,
    StatusReportsModule,
    AttachmentsModule,
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService, ProjectsRepository],
})
export class ProjectsModule {}
