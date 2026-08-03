import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsIn,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateRiskDto {
  @ApiProperty({
    example: 'Vendor SSO integration may slip past the pilot date',
    description: 'Risk statement (FDD Fig 6 caps this at 200 characters).',
  })
  @IsString()
  @MaxLength(200)
  statement!: string;

  @ApiPropertyOptional({ example: 'Amna Khalid' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  identified_by?: string | null;

  @ApiPropertyOptional({ format: 'date', example: '2026-07-30' })
  @IsOptional()
  @IsDateString()
  date_identified?: string | null;

  @ApiPropertyOptional({
    format: 'uuid',
    description: 'Fetch from `GET /lookups/risk-sources`.',
  })
  @IsOptional()
  @IsUUID()
  source_id?: string | null;

  @ApiPropertyOptional({
    format: 'uuid',
    description: 'Fetch from `GET /lookups/risk-categories`.',
  })
  @IsOptional()
  @IsUUID()
  category_id?: string | null;

  @ApiPropertyOptional({
    format: 'uuid',
    description: 'Owning user. Fetch from `GET /users`.',
  })
  @IsOptional()
  @IsUUID()
  owner_id?: string | null;

  @ApiPropertyOptional({
    format: 'uuid',
    description: 'Fetch from `GET /lookups/risk-probability-levels`.',
  })
  @IsOptional()
  @IsUUID()
  probability_id?: string | null;

  @ApiPropertyOptional({
    format: 'uuid',
    description: 'Fetch from `GET /lookups/risk-impact-levels`.',
  })
  @IsOptional()
  @IsUUID()
  impact_id?: string | null;

  @ApiPropertyOptional({
    format: 'uuid',
    description: 'Fetch from `GET /lookups/risk-responses`.',
  })
  @IsOptional()
  @IsUUID()
  response_id?: string | null;

  @ApiPropertyOptional({
    example: 'Weekly integration checkpoint with the vendor from August.',
  })
  @IsOptional()
  @IsString()
  response_plan?: string | null;

  @ApiPropertyOptional({ example: 'High' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  priority?: string | null;

  @ApiPropertyOptional({
    example: 'Escalate to the PMO partner if the August checkpoint slips.',
    description: 'Next action (FDD Fig 6 caps this at 200 characters).',
  })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  action?: string | null;

  @ApiPropertyOptional({ enum: ['open', 'closed'], example: 'open' })
  @IsOptional()
  @IsIn(['open', 'closed'])
  status?: 'open' | 'closed';

  @ApiPropertyOptional({
    enum: ['risk', 'issue'],
    example: 'risk',
    description: "FDD register's RISK/ISSUE toggle.",
  })
  @IsOptional()
  @IsIn(['risk', 'issue'])
  type?: 'risk' | 'issue';
}
