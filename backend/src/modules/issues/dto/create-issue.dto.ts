import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsIn,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateIssueDto {
  @ApiProperty({ example: 'Legacy rows fail the checksum validation' })
  @IsString()
  @MaxLength(255)
  title!: string;

  @ApiPropertyOptional({
    format: 'uuid',
    description: 'Fetch from `GET /lookups/project-roles`.',
  })
  @IsOptional()
  @IsUUID()
  role_id?: string | null;

  @ApiPropertyOptional({
    format: 'uuid',
    description: 'Owning user. Fetch from `GET /users`.',
  })
  @IsOptional()
  @IsUUID()
  owner_id?: string | null;

  @ApiPropertyOptional({ enum: ['open', 'closed'], example: 'open' })
  @IsOptional()
  @IsIn(['open', 'closed'])
  status?: 'open' | 'closed';

  @ApiPropertyOptional({
    format: 'uuid',
    description: 'Severity. Fetch from `GET /lookups/issue-levels`.',
  })
  @IsOptional()
  @IsUUID()
  level_id?: string | null;

  @ApiPropertyOptional({
    format: 'uuid',
    description: 'Fetch from `GET /lookups/issue-categories`.',
  })
  @IsOptional()
  @IsUUID()
  category_id?: string | null;

  @ApiPropertyOptional({
    example: 'Roughly 400 rows in the 2019 partition fail validation.',
  })
  @IsOptional()
  @IsString()
  description?: string | null;

  @ApiPropertyOptional({ example: 'https://intranet.example.com/tickets/4821' })
  @IsOptional()
  @IsString()
  @MaxLength(2048)
  url?: string | null;

  @ApiPropertyOptional({ type: [String], example: ['data-quality'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[] | null;

  @ApiPropertyOptional({
    example: 'Re-ran the import with the corrected mapping.',
  })
  @IsOptional()
  @IsString()
  resolution?: string | null;
}
