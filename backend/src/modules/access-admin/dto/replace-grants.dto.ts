import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class ReplaceGrantsDto {
  /** Full capability set for the role — the grid submits it wholesale. */
  @ApiProperty({ example: ['projects.create', 'cycles.close'] })
  @IsArray()
  @IsString({ each: true })
  capabilities!: string[];
}
