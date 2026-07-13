import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateUpdateDto {
  @ApiProperty({
    example: 'Dry run completed against staging with no data loss.',
  })
  @IsString()
  body!: string;

  @ApiPropertyOptional({
    format: 'uuid',
    description: 'Fetch from `GET /lookups/update-types`.',
  })
  @IsOptional()
  @IsUUID()
  type_id?: string | null;

  @ApiPropertyOptional({
    example: false,
    description: 'Pins this update as a headline.',
  })
  @IsOptional()
  @IsBoolean()
  is_gold?: boolean;

  @ApiPropertyOptional({ type: [String], example: ['migration'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[] | null;
}
