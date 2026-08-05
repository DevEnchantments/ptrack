import { PartialType } from '@nestjs/swagger';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { CreateKpiDto } from './create-kpi.dto';

export class UpdateKpiDto extends PartialType(CreateKpiDto) {}

/** Fig 28 reading. */
export class CreateKpiReadingDto {
  @ApiProperty({ format: 'date', example: '2026-06-30' })
  @IsDateString()
  reading_date!: string;

  @ApiProperty({ example: 48.5 })
  @IsNumber()
  value!: number;

  @ApiPropertyOptional({
    example: 'Coverage improved after the school outreach round.',
  })
  @IsOptional()
  @IsString()
  performance_analysis?: string | null;
}

/** Fig 29 action plan. */
export class CreateKpiActionPlanDto {
  @ApiProperty({ example: 'Extend screening vans to the western region.' })
  @IsString()
  @MaxLength(500)
  description!: string;

  @ApiPropertyOptional({ example: 'Outreach team lead' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  owner?: string | null;

  @ApiPropertyOptional({ format: 'date', example: '2026-09-30' })
  @IsOptional()
  @IsDateString()
  due_date?: string | null;

  @ApiPropertyOptional({ enum: ['open', 'done'], example: 'open' })
  @IsOptional()
  @IsIn(['open', 'done'])
  status?: 'open' | 'done';
}

export class UpdateKpiActionPlanDto extends PartialType(
  CreateKpiActionPlanDto,
) {}
