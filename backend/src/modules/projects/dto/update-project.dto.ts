import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNumber,
  Max,
  Min,
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

  @ApiPropertyOptional({ example: '1.1.1' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  reference_id?: string | null;

  @ApiPropertyOptional({ example: 'PRJ-0239' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  project_number?: string | null;

  @ApiPropertyOptional({ example: 26 })
  @IsOptional()
  @IsInt()
  plan_year?: number | null;

  @ApiPropertyOptional({ example: '2' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  finance_code?: string | null;

  @ApiPropertyOptional({ example: 'All members of Abu Dhabi community' })
  @IsOptional()
  @IsString()
  target_group?: string | null;

  @ApiPropertyOptional({ example: 'PMO office' })
  @IsOptional()
  @IsString()
  internal_stakeholder?: string | null;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  is_priority?: boolean;

  @ApiPropertyOptional({ example: 30000000 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  approved_budget?: number | null;

  @ApiPropertyOptional({ example: 20827300 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  utilized_budget?: number | null;

  @ApiPropertyOptional({
    format: 'uuid',
    description: 'Fetch from `GET /lookups/tiers`.',
  })
  @IsOptional()
  @IsUUID()
  tier_id?: string | null;

  @ApiPropertyOptional({
    format: 'uuid',
    description: 'Fetch from `GET /lookups/strategic-objectives`.',
  })
  @IsOptional()
  @IsUUID()
  strategic_objective_id?: string | null;

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
  at_risk?: boolean | null;

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

  @ApiPropertyOptional({
    type: [String],
    example: ['Department of Education', 'Vendor: MedSupply Co'],
    description: 'External stakeholders as free-text chips (FDD Fig 11).',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  external_stakeholders?: string[] | null;

  @ApiPropertyOptional({
    format: 'uuid',
    description: 'Fetch from `GET /lookups/sectors`.',
  })
  @IsOptional()
  @IsUUID()
  sector_id?: string | null;

  @ApiPropertyOptional({
    format: 'uuid',
    description:
      'Cascades under the strategic objective. Fetch from `GET /lookups/strategic-programs`.',
  })
  @IsOptional()
  @IsUUID()
  strategic_program_id?: string | null;

  @ApiPropertyOptional({
    example: 'Dept. of Community Development',
    description: 'FDD 3.3.2 mandatory field (enforced in the UI).',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  sponsor?: string | null;

  @ApiPropertyOptional({
    format: 'date',
    example: '2026-12-31',
    description: 'Target end date — FDD 3.3.2 mandatory (enforced in the UI).',
  })
  @IsOptional()
  @IsDateString()
  target_end_date?: string | null;
}
