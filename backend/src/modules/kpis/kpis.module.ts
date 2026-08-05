import { Module } from '@nestjs/common';
import { KpisController } from './kpis.controller';
import { KpisService } from './kpis.service';
import { KpisRepository } from './kpis.repository';

@Module({
  controllers: [KpisController],
  providers: [KpisService, KpisRepository],
  exports: [KpisService],
})
export class KpisModule {}
