import { Module } from '@nestjs/common';
import { TemplatesController } from './templates.controller';
import { TemplatesService } from './templates.service';
import { ProjectsModule } from '../projects/projects.module';
import { MilestonesModule } from '../milestones/milestones.module';
import { ProgramOutcomesModule } from '../program-outcomes/program-outcomes.module';

@Module({
  imports: [ProjectsModule, MilestonesModule, ProgramOutcomesModule],
  controllers: [TemplatesController],
  providers: [TemplatesService],
})
export class TemplatesModule {}
