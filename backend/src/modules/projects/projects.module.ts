import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { ProjectsRepository } from './projects.repository';
import { NotificationsModule } from '../notifications/notifications.module';

// The eleven domain-module imports left with the section fan-out — see
// ProjectSectionsModule. Keeping this module import-light is what lets other
// domains import ProjectsModule without a cycle.
@Module({
  imports: [NotificationsModule],
  controllers: [ProjectsController],
  providers: [ProjectsService, ProjectsRepository],
  // The repository is exported for modules that only need project rows
  // (risks' alert, submissions' gate) without the full service.
  exports: [ProjectsService, ProjectsRepository],
})
export class ProjectsModule {}
