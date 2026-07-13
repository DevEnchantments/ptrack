import { PartialType } from '@nestjs/swagger';
import { CreateActionItemDto } from './create-action-item.dto';

export class UpdateActionItemDto extends PartialType(CreateActionItemDto) {}
