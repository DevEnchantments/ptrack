import { Module } from '@nestjs/common';
import { RisksController } from './risks.controller';
import { RisksService } from './risks.service';
import { RisksRepository } from './risks.repository';

@Module({
  controllers: [RisksController],
  providers: [RisksService, RisksRepository],
  exports: [RisksService],
})
export class RisksModule {}
