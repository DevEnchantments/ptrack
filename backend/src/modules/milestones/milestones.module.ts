import { Module } from '@nestjs/common';
import { MilestonesController } from './milestones.controller';
import { MilestonesService } from './milestones.service';
import { MilestonesRepository } from './milestones.repository';

@Module({
  controllers: [MilestonesController],
  providers: [MilestonesService, MilestonesRepository],
  exports: [MilestonesService],
})
export class MilestonesModule {}
