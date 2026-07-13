import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateMilestoneDto {
  @ApiProperty({ example: 'Schema cutover complete' })
  @IsString()
  @MaxLength(255)
  name!: string;

  @ApiProperty({ format: 'date', example: '2026-07-13' })
  @IsDateString()
  start_date!: string;

  @ApiProperty({ format: 'date', example: '2026-08-31' })
  @IsDateString()
  due_date!: string;

  @ApiProperty({
    enum: ['open', 'closed_completed', 'not_applicable'],
    example: 'open',
  })
  @IsIn(['open', 'closed_completed', 'not_applicable'])
  status!: 'open' | 'closed_completed' | 'not_applicable';

  @ApiPropertyOptional({
    format: 'uuid',
    description: 'Fetch from `GET /lookups/project-roles`.',
  })
  @IsOptional()
  @IsUUID()
  role_id?: string | null;

  @ApiPropertyOptional({
    format: 'uuid',
    description: 'Owning user. Fetch from `GET /users`.',
  })
  @IsOptional()
  @IsUUID()
  owner_id?: string | null;

  @ApiPropertyOptional({
    example: false,
    description: 'Flags this as a major milestone.',
  })
  @IsOptional()
  @IsBoolean()
  is_major?: boolean;

  @ApiPropertyOptional({ example: 'All tables migrated and verified.' })
  @IsOptional()
  @IsString()
  description?: string | null;

  @ApiPropertyOptional({ type: [String], example: ['migration'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[] | null;

  @ApiPropertyOptional({
    example: 20,
    description: 'Relative weight of this milestone within the project.',
  })
  @IsOptional()
  @IsNumber()
  weightage?: number | null;

  @ApiPropertyOptional({ example: 0, description: '0–100.' })
  @IsOptional()
  @IsNumber()
  percent_complete?: number | null;
}
