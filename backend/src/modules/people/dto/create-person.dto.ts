import { IsIn, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreatePersonDto {
  @IsOptional() @IsUUID()
  user_id?: string | null;

  @IsOptional() @IsString() @MaxLength(255)
  pending_name?: string | null;

  @IsUUID()
  role_id!: string;

  @IsIn(['read_only', 'read_write', 'read_write_admin'])
  access_level!: 'read_only' | 'read_write' | 'read_write_admin';

  @IsOptional() @IsUUID()
  involvement_level_id?: string | null;

  @IsOptional() @IsString()
  notes?: string | null;
}