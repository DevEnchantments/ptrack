import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

/**
 * One code-table value. The three extra columns apply to specific tables only
 * (color → project-statuses, rank → issue-levels, default_access_level →
 * project-roles); the service rejects them elsewhere.
 */
export class CreateLookupValueDto {
  @ApiProperty({ example: 'On Hold' })
  @IsString()
  @MaxLength(120)
  name!: string;

  @ApiPropertyOptional({ example: 3 })
  @IsOptional()
  @IsInt()
  @Min(0)
  sort_order?: number;

  @ApiPropertyOptional({
    example: '#f59e0b',
    description: 'project-statuses only',
  })
  @IsOptional()
  @IsString()
  @MaxLength(32)
  color?: string | null;

  @ApiPropertyOptional({ example: 2, description: 'issue-levels only' })
  @IsOptional()
  @IsInt()
  rank?: number;

  @ApiPropertyOptional({
    enum: ['read_only', 'read_write', 'read_write_admin'],
    description: 'project-roles only',
  })
  @IsOptional()
  @IsIn(['read_only', 'read_write', 'read_write_admin'])
  default_access_level?: string;
}

export class UpdateLookupValueDto extends PartialType(CreateLookupValueDto) {
  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
