import { Module } from '@nestjs/common';
import {
  CyclesController,
  ReportsController,
  SubmissionsController,
} from './submissions.controller';
import { SubmissionsService } from './submissions.service';
import { SubmissionsRepository } from './submissions.repository';
import { ProjectsModule } from '../projects/projects.module';
import { MilestonesModule } from '../milestones/milestones.module';
import { NotificationsModule } from '../notifications/notifications.module';

// The gate's ProjectsRepository/MilestonesRepository come from the real
// modules now — the cycle that once forced direct repository providers went
// away with the project-sections extraction.
@Module({
  imports: [NotificationsModule, ProjectsModule, MilestonesModule],
  controllers: [CyclesController, ReportsController, SubmissionsController],
  providers: [SubmissionsService, SubmissionsRepository],
  exports: [SubmissionsService],
})
export class SubmissionsModule {}
