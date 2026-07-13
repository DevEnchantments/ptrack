import { PartialType } from '@nestjs/swagger';
import { CreateUpdateDto } from './create-update.dto';

export class UpdateUpdateDto extends PartialType(CreateUpdateDto) {}
