import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNumber,
  Max,
  Min,
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

  @ApiPropertyOptional({ example: '1.1.1', description: 'FDD Reference ID.' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  reference_id?: string;

  @ApiPropertyOptional({ example: 'PRJ-0239' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  project_number?: string;

  @ApiPropertyOptional({ example: 26, description: 'Plan (fiscal) year.' })
  @IsOptional()
  @IsInt()
  plan_year?: number;

  @ApiPropertyOptional({ example: '2' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  finance_code?: string;

  @ApiPropertyOptional({ example: 'All members of Abu Dhabi community' })
  @IsOptional()
  @IsString()
  target_group?: string;

  @ApiPropertyOptional({ example: 'PMO office' })
  @IsOptional()
  @IsString()
  internal_stakeholder?: string;

  @ApiPropertyOptional({ example: false, description: 'Priority star.' })
  @IsOptional()
  @IsBoolean()
  is_priority?: boolean;

  @ApiPropertyOptional({
    example: 30000000,
    description: 'Approved budget (AED).',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  approved_budget?: number;

  @ApiPropertyOptional({
    example: 20827300,
    description:
      'Utilized budget (AED). Manual for now; FDD 3.7 leaves derivation open.',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  utilized_budget?: number;

  @ApiPropertyOptional({
    format: 'uuid',
    description: 'Fetch from `GET /lookups/tiers`.',
  })
  @IsOptional()
  @IsUUID()
  tier_id?: string;

  @ApiPropertyOptional({
    format: 'uuid',
    description: 'Fetch from `GET /lookups/strategic-objectives`.',
  })
  @IsOptional()
  @IsUUID()
  strategic_objective_id?: string;

  @ApiPropertyOptional({
    example: 35,
    description: 'FDD manual progress: user-entered percent, 0-100.',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  manual_progress?: number | null;

  @ApiPropertyOptional({ example: false, description: 'FDD at-risk flag.' })
  @IsOptional()
  @IsBoolean()
  at_risk?: boolean;

  @ApiPropertyOptional({
    format: 'uuid',
    description: 'Project Owner (user). Fetch from `GET /users`.',
  })
  @IsOptional()
  @IsUUID()
  owner_id?: string | null;

  @ApiPropertyOptional({
    format: 'uuid',
    description: 'Project Manager (user). Fetch from `GET /users`.',
  })
  @IsOptional()
  @IsUUID()
  project_manager_id?: string | null;

  @ApiPropertyOptional({
    format: 'uuid',
    description: 'Project Manager 2 (user). Fetch from `GET /users`.',
  })
  @IsOptional()
  @IsUUID()
  project_manager2_id?: string | null;

  @ApiPropertyOptional({
    format: 'uuid',
    description: 'PMO Partner (user). Fetch from `GET /users`.',
  })
  @IsOptional()
  @IsUUID()
  pmo_partner_id?: string | null;

  @ApiPropertyOptional({ type: [ProjectMemberDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProjectMemberDto)
  members?: ProjectMemberDto[];
}
