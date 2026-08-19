import { Module } from '@nestjs/common';
import { KpisController } from './kpis.controller';
import { KpisService } from './kpis.service';
import { KpisRepository } from './kpis.repository';

// No exports: nothing outside this module injects KpisService. If that
// changes, add an index.ts alongside the export so the surface widens
// deliberately rather than by habit.
@Module({
  controllers: [KpisController],
  providers: [KpisService, KpisRepository],
})
export class KpisModule {}
