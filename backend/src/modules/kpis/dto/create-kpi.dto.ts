import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

/** Fig 27 KPI definition. */
export class CreateKpiDto {
  @ApiProperty({ example: 'Screening coverage rate' })
  @IsString()
  @MaxLength(255)
  name!: string;

  @ApiPropertyOptional({ example: 'Share of the target population screened.' })
  @IsOptional()
  @IsString()
  description?: string | null;

  @ApiPropertyOptional({ example: 'Community Health' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  pillar?: string | null;

  @ApiPropertyOptional({ example: 'Public Health Department' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  entity?: string | null;

  @ApiPropertyOptional({ example: '%' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  unit?: string | null;

  @ApiPropertyOptional({
    enum: ['higher_is_better', 'lower_is_better'],
    example: 'higher_is_better',
  })
  @IsOptional()
  @IsIn(['higher_is_better', 'lower_is_better'])
  polarity?: 'higher_is_better' | 'lower_is_better';

  @ApiPropertyOptional({ example: 1, description: '0-4 decimal places.' })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(4)
  decimal_places?: number;

  @ApiPropertyOptional({ example: 'Quarterly screening registry extract' })
  @IsOptional()
  @IsString()
  data_source?: string | null;

  @ApiPropertyOptional({
    example: 'Screened individuals / target population x 100',
    description: 'Free-text method (the computation itself awaits sign-off).',
  })
  @IsOptional()
  @IsString()
  calculation_method?: string | null;

  @ApiPropertyOptional({
    enum: ['monthly', 'quarterly', 'annual'],
    example: 'quarterly',
  })
  @IsOptional()
  @IsIn(['monthly', 'quarterly', 'annual'])
  frequency?: 'monthly' | 'quarterly' | 'annual';

  @ApiPropertyOptional({ example: 'Tracks the early-detection objective.' })
  @IsOptional()
  @IsString()
  rationale?: string | null;

  @ApiPropertyOptional({ example: 42 })
  @IsOptional()
  @IsNumber()
  baseline?: number | null;

  @ApiPropertyOptional({ example: 65 })
  @IsOptional()
  @IsNumber()
  target?: number | null;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  is_priority?: boolean;

  @ApiPropertyOptional({
    format: 'uuid',
    description: 'Fetch from `GET /lookups/tiers`.',
  })
  @IsOptional()
  @IsUUID()
  tier_id?: string | null;

  @ApiPropertyOptional({
    format: 'uuid',
    description: 'Fetch from `GET /lookups/strategic-objectives`.',
  })
  @IsOptional()
  @IsUUID()
  objective_id?: string | null;

  @ApiPropertyOptional({
    format: 'uuid',
    description: 'Owning user. Fetch from `GET /users`.',
  })
  @IsOptional()
  @IsUUID()
  owner_id?: string | null;
}
