import { Module } from '@nestjs/common';
import { LookupsController } from './lookups.controller';
import { LookupsService } from './lookups.service';

@Module({
  controllers: [LookupsController],
  providers: [LookupsService],
})
export class LookupsModule {}
