import { Module } from '@nestjs/common';
import { RisksController } from './risks.controller';
import { RisksService } from './risks.service';
import { RisksRepository } from './risks.repository';
import { NotificationsModule } from '../notifications/notifications.module';
import { ProjectsModule } from '../projects/projects.module';

// The alert's ProjectsRepository comes from ProjectsModule now — the cycle
// that once forced a direct repository provider went away with the
// project-sections extraction.
@Module({
  imports: [NotificationsModule, ProjectsModule],
  controllers: [RisksController],
  providers: [RisksService, RisksRepository],
  exports: [RisksService],
})
export class RisksModule {}
