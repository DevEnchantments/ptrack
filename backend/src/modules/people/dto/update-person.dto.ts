import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsIn, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdatePersonDto {
  @ApiPropertyOptional({
    format: 'uuid',
    description: 'Fetch from `GET /lookups/project-roles`.',
  })
  @IsOptional()
  @IsUUID()
  role_id?: string;

  @ApiPropertyOptional({
    enum: ['read_only', 'read_write', 'read_write_admin'],
    example: 'read_write',
  })
  @IsOptional()
  @IsIn(['read_only', 'read_write', 'read_write_admin'])
  access_level?: 'read_only' | 'read_write' | 'read_write_admin';

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

  @ApiPropertyOptional({ example: 'dana.whitfield@poc.ptrack.local' })
  @IsOptional()
  @IsEmail()
  pending_email?: string | null;
}
