import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateResourceDto {
  @ApiProperty({ example: 'Staging database cluster' })
  @IsString()
  @MaxLength(255)
  name!: string;

  @ApiProperty({
    format: 'uuid',
    description: 'Required. Fetch from `GET /lookups/resource-types`.',
  })
  @IsUUID()
  type_id!: string;

  @ApiPropertyOptional({ example: 'Reserved for the migration dry runs.' })
  @IsOptional()
  @IsString()
  description?: string | null;
}
