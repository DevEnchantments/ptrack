import { Module } from '@nestjs/common';
import { LookupsController } from './lookups.controller';
import { LookupsService } from './lookups.service';
import { LookupsRepository } from './lookups.repository';

@Module({
  controllers: [LookupsController],
  providers: [LookupsService, LookupsRepository],
})
export class LookupsModule {}
