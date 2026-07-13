import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateAttachmentDto {
  @ApiPropertyOptional({
    example: false,
    description: 'Pins this attachment as a key document.',
  })
  @IsOptional()
  @IsBoolean()
  is_gold?: boolean;

  @ApiPropertyOptional({ example: 'Signed-off cutover runbook, v3.' })
  @IsOptional()
  @IsString()
  description?: string | null;

  @ApiPropertyOptional({ type: [String], example: ['runbook'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[] | null;
}
