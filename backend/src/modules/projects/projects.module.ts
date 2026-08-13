import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { ProjectsRepository } from './projects.repository';
import { NotificationsModule } from '../notifications/notifications.module';

/**
 * The eleven domain modules this used to import moved to ProjectSectionsModule
 * with the section fan-out. What remains is the project record itself, plus
 * notifications for the budget-threshold alert.
 */
@Module({
  imports: [NotificationsModule],
  controllers: [ProjectsController],
  providers: [ProjectsService, ProjectsRepository],
  exports: [ProjectsService],
})
export class ProjectsModule {}
