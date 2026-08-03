import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';

export class WeightEntryDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  id!: string;

  @ApiPropertyOptional({
    example: 25,
    description: 'Null clears the weight.',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  weightage?: number | null;
}

/** UC-08 Adjust Weights: batch weight update for a project's milestones. */
export class AdjustWeightsDto {
  @ApiProperty({ type: [WeightEntryDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WeightEntryDto)
  weights!: WeightEntryDto[];
}
