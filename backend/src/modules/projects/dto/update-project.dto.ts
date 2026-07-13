import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsIn,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class UpdateProjectDto {
  @ApiPropertyOptional({ example: 'Apollo Data Migration' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @ApiPropertyOptional({
    format: 'uuid',
    description:
      'Parent project for hierarchy. Fetch from `GET /projects`. Send null to detach.',
  })
  @IsOptional()
  @IsUUID()
  parent_project_id?: string | null;

  @ApiPropertyOptional({
    format: 'uuid',
    description: 'Fetch from `GET /lookups/project-statuses`.',
  })
  @IsOptional()
  @IsUUID()
  status_id?: string | null;

  @ApiPropertyOptional({
    format: 'uuid',
    description: 'Fetch from `GET /lookups/project-sizes`.',
  })
  @IsOptional()
  @IsUUID()
  size_id?: string | null;

  @ApiPropertyOptional({
    format: 'uuid',
    description: 'Fetch from `GET /lookups/project-categories`.',
  })
  @IsOptional()
  @IsUUID()
  category_id?: string | null;

  @ApiPropertyOptional({
    enum: ['open', 'restricted'],
    example: 'open',
    description: '"restricted" limits visibility to assigned members.',
  })
  @IsOptional()
  @IsIn(['open', 'restricted'])
  access_control?: 'open' | 'restricted';

  @ApiPropertyOptional({
    example: 'Migrate the legacy Apollo dataset onto the new platform.',
  })
  @IsOptional()
  @IsString()
  description?: string | null;

  @ApiPropertyOptional({ example: 'Zero-downtime cutover by end of Q3.' })
  @IsOptional()
  @IsString()
  goal?: string | null;

  @ApiPropertyOptional({ example: 'Finance Division' })
  @IsOptional()
  @IsString()
  customer?: string | null;

  @ApiPropertyOptional({ example: 'https://intranet.example.com/apollo' })
  @IsOptional()
  @IsString()
  primary_url?: string | null;

  @ApiPropertyOptional({ type: [String], example: ['migration', 'q3'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[] | null;

  @ApiPropertyOptional({ format: 'date', example: '2026-07-13' })
  @IsOptional()
  @IsDateString()
  start_date?: string | null;
}
