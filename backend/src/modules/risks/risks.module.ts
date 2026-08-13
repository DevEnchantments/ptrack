import { Module } from '@nestjs/common';
import { RisksController } from './risks.controller';
import { RisksService } from './risks.service';
import { RisksRepository } from './risks.repository';
import { NotificationsModule } from '../notifications/notifications.module';
import { ProjectsRepository } from '../projects/projects.repository';

@Module({
  imports: [NotificationsModule],
  controllers: [RisksController],
  // ProjectsRepository directly (not the service) — the alert only needs a
  // project row, and the full ProjectsService would create a module cycle.
  providers: [RisksService, RisksRepository, ProjectsRepository],
  exports: [RisksService],
})
export class RisksModule {}
