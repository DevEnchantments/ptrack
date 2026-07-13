import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

export class CreateLinkDto {
  @ApiProperty({
    example: 'https://intranet.example.com/apollo/runbook',
    description: 'Must start with http:// or https://.',
  })
  @IsString()
  @MaxLength(2048)
  @Matches(/^https?:\/\//, {
    message: 'URL must start with http:// or https://',
  })
  url!: string;

  @ApiPropertyOptional({ example: 'Cutover runbook' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  label?: string | null;

  @ApiPropertyOptional({ example: 'Step-by-step cutover procedure.' })
  @IsOptional()
  @IsString()
  description?: string | null;

  @ApiPropertyOptional({
    example: false,
    description: 'Pins this link as a key reference.',
  })
  @IsOptional()
  @IsBoolean()
  is_gold?: boolean;

  @ApiPropertyOptional({ type: [String], example: ['runbook'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[] | null;
}
