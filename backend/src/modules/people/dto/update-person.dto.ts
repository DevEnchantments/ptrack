import { IsIn, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdatePersonDto {
  @IsOptional() @IsUUID()
  role_id?: string;

  @IsOptional() @IsIn(['read_only', 'read_write', 'read_write_admin'])
  access_level?: 'read_only' | 'read_write' | 'read_write_admin';

  @IsOptional() @IsUUID()
  involvement_level_id?: string | null;

  @IsOptional() @IsString()
  notes?: string | null;
}