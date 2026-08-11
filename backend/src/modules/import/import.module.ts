import { Module } from '@nestjs/common';
import { ImportController } from './import.controller';
import { ImportService } from './import.service';
import { ProjectsModule } from '../projects/projects.module';
import { MilestonesModule } from '../milestones/milestones.module';

@Module({
  imports: [ProjectsModule, MilestonesModule],
  controllers: [ImportController],
  providers: [ImportService],
})
export class ImportModule {}
