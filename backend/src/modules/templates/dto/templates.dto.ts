import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateTemplateDto {
  @ApiProperty({ example: 'Standard screening program' })
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  name!: string;

  @ApiPropertyOptional({ example: 'Outcomes + weighted milestone plan.' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string | null;

  @ApiProperty({
    format: 'uuid',
    description: 'Source project whose structure is snapshotted.',
  })
  @IsUUID()
  project_id!: string;
}

export class InstantiateTemplateDto {
  @ApiProperty({ example: 'Regional Screening Program 2027' })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  name!: string;

  @ApiPropertyOptional({ format: 'date', example: '2027-01-01' })
  @IsOptional()
  @IsDateString()
  start_date?: string;

  @ApiPropertyOptional({ format: 'date', example: '2027-09-30' })
  @IsOptional()
  @IsDateString()
  target_end_date?: string;
}
