import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateProgramOutcomeDto {
  @ApiProperty({ example: 'Improved early-detection coverage' })
  @IsString()
  @MaxLength(255)
  name!: string;

  @ApiPropertyOptional({
    example: 1,
    description:
      'Outcome number (FDD Fig 2). Auto-assigned as next-in-project when omitted.',
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  sort_order?: number | null;

  @ApiPropertyOptional({ format: 'date', example: '2026-01-01' })
  @IsOptional()
  @IsDateString()
  start_date?: string | null;

  @ApiPropertyOptional({ format: 'date', example: '2026-06-30' })
  @IsOptional()
  @IsDateString()
  end_date?: string | null;
}
