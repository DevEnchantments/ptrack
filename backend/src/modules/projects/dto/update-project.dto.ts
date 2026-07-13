import {
  IsArray, IsDateString, IsIn, IsOptional, IsString, IsUUID, MaxLength,
} from 'class-validator';

export class UpdateProjectDto {
  @IsOptional() @IsString() @MaxLength(255)
  name?: string;

  @IsOptional() @IsUUID()
  parent_project_id?: string | null;

  @IsOptional() @IsUUID()
  status_id?: string | null;

  @IsOptional() @IsUUID()
  size_id?: string | null;

  @IsOptional() @IsUUID()
  category_id?: string | null;

  @IsOptional() @IsIn(['open', 'restricted'])
  access_control?: 'open' | 'restricted';

  @IsOptional() @IsString()
  description?: string | null;

  @IsOptional() @IsString()
  goal?: string | null;

  @IsOptional() @IsString()
  customer?: string | null;

  @IsOptional() @IsString()
  primary_url?: string | null;

  @IsOptional() @IsArray() @IsString({ each: true })
  tags?: string[] | null;

  @IsOptional() @IsDateString()
  start_date?: string | null;
}