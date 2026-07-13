import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  ValidateNested,
} from 'class-validator';

export class ProjectMemberDto {
  @ApiPropertyOptional({
    format: 'uuid',
    description:
      'Existing user, from `GET /users`. Omit and use pending_name for someone with no account yet.',
  })
  @IsOptional()
  @IsUUID()
  user_id?: string | null;

  @ApiPropertyOptional({
    example: 'Dana Whitfield',
    description: 'Placeholder name for a member who has no user account yet.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  pending_name?: string | null;

  @ApiProperty({
    format: 'uuid',
    description: 'Required. Fetch from `GET /lookups/project-roles`.',
  })
  @IsUUID()
  role_id!: string;
}

export class CreateProjectDto {
  @ApiProperty({ example: 'Apollo Data Migration' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name!: string;

  @ApiPropertyOptional({
    format: 'uuid',
    description: 'Parent project for hierarchy. Fetch from `GET /projects`.',
  })
  @IsOptional()
  @IsUUID()
  parent_project_id?: string;

  @ApiPropertyOptional({ format: 'date', example: '2026-07-13' })
  @IsOptional()
  @IsDateString()
  start_date?: string;

  @ApiPropertyOptional({
    enum: ['open', 'restricted'],
    example: 'open',
    description: '"restricted" limits visibility to assigned members.',
  })
  @IsOptional()
  @IsIn(['open', 'restricted'])
  access_control?: 'open' | 'restricted';

  @ApiPropertyOptional({
    format: 'uuid',
    description: 'Fetch from `GET /lookups/project-statuses`.',
  })
  @IsOptional()
  @IsUUID()
  status_id?: string;

  @ApiPropertyOptional({
    format: 'uuid',
    description: 'Fetch from `GET /lookups/project-categories`.',
  })
  @IsOptional()
  @IsUUID()
  category_id?: string;

  @ApiPropertyOptional({
    format: 'uuid',
    description: 'Fetch from `GET /lookups/project-sizes`.',
  })
  @IsOptional()
  @IsUUID()
  size_id?: string;

  @ApiPropertyOptional({
    example: 'Migrate the legacy Apollo dataset onto the new platform.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'Zero-downtime cutover by end of Q3.' })
  @IsOptional()
  @IsString()
  goal?: string;

  @ApiPropertyOptional({ example: 'Finance Division' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  customer?: string;

  @ApiPropertyOptional({ type: [String], example: ['migration', 'q3'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({ example: 'https://intranet.example.com/apollo' })
  @IsOptional()
  @IsString()
  @MaxLength(2048)
  primary_url?: string;

  @ApiPropertyOptional({ type: [ProjectMemberDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProjectMemberDto)
  members?: ProjectMemberDto[];
}
