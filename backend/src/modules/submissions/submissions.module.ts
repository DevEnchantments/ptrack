import { Module } from '@nestjs/common';
import { SubmissionsController } from './submissions.controller';
import { SubmissionsService } from './submissions.service';
import { SubmissionsRepository } from './submissions.repository';
import { ProjectsRepository } from '../projects/projects.repository';
import { MilestonesRepository } from '../milestones/milestones.repository';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [NotificationsModule],
  controllers: [SubmissionsController],
  providers: [
    SubmissionsService,
    SubmissionsRepository,
    // Direct repository deps (not services) — the gate reads raw rows and
    // pulling in the full ProjectsService would create a module cycle.
    ProjectsRepository,
    MilestonesRepository,
  ],
  exports: [SubmissionsService],
})
export class SubmissionsModule {}
