import { Module } from '@nestjs/common';
import { ProgramOutcomesController } from './program-outcomes.controller';
import { ProgramOutcomesService } from './program-outcomes.service';
import { ProgramOutcomesRepository } from './program-outcomes.repository';

@Module({
  controllers: [ProgramOutcomesController],
  providers: [ProgramOutcomesService, ProgramOutcomesRepository],
  exports: [ProgramOutcomesService],
})
export class ProgramOutcomesModule {}
