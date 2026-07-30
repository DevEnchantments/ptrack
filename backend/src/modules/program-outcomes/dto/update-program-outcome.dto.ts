import { PartialType } from '@nestjs/swagger';
import { CreateProgramOutcomeDto } from './create-program-outcome.dto';

export class UpdateProgramOutcomeDto extends PartialType(
  CreateProgramOutcomeDto,
) {}
