import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreatePersonDto {
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
    description: 'Placeholder name for a person who has no user account yet.',
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

  @ApiProperty({
    enum: ['read_only', 'read_write', 'read_write_admin'],
    example: 'read_write',
  })
  @IsIn(['read_only', 'read_write', 'read_write_admin'])
  access_level!: 'read_only' | 'read_write' | 'read_write_admin';

  @ApiPropertyOptional({
    format: 'uuid',
    description: 'Fetch from `GET /lookups/involvement-levels`.',
  })
  @IsOptional()
  @IsUUID()
  involvement_level_id?: string | null;

  @ApiPropertyOptional({ example: 'Joining for the cutover phase only.' })
  @IsOptional()
  @IsString()
  notes?: string | null;
}
