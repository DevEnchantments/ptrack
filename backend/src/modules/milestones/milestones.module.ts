import { Module } from '@nestjs/common';
import { MilestonesController } from './milestones.controller';
import { MilestonesService } from './milestones.service';
import { MilestonesRepository } from './milestones.repository';

@Module({
  controllers: [MilestonesController],
  providers: [MilestonesService, MilestonesRepository],
  // The repository is exported for submissions' weight gate, which reads raw
  // milestone rows without needing the full service.
  exports: [MilestonesService, MilestonesRepository],
})
export class MilestonesModule {}
