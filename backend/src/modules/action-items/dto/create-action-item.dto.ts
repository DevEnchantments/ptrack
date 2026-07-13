import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  IsArray,
  IsDateString,
  IsIn,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateActionItemDto {
  @ApiProperty({ example: 'Draft the rollback plan' })
  @IsString()
  @MaxLength(255)
  title!: string;

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
    description:
      'Milestone this item rolls up to. Fetch from `GET /projects/{projectId}/milestones`.',
  })
  @IsOptional()
  @IsUUID()
  milestone_id?: string | null;

  @ApiPropertyOptional({
    format: 'uuid',
    description: 'Fetch from `GET /lookups/action-item-types`.',
  })
  @IsOptional()
  @IsUUID()
  type_id?: string | null;

  @ApiPropertyOptional({
    format: 'uuid',
    description: 'Fetch from `GET /lookups/project-roles`.',
  })
  @IsOptional()
  @IsUUID()
  role_id?: string | null;

  @ApiPropertyOptional({ example: 'Cover both the data and app tiers.' })
  @IsOptional()
  @IsString()
  description?: string | null;

  @ApiPropertyOptional({ type: [String], example: ['migration'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[] | null;

  @ApiPropertyOptional({
    type: [String],
    format: 'uuid',
    description: 'Up to 4 owning users. Fetch from `GET /users`.',
  })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(4)
  @IsUUID('4', { each: true })
  owner_ids?: string[];
}
