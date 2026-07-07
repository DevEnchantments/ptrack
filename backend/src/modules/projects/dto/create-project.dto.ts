import { Type } from 'class-transformer';
import {
  IsArray,
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
  @IsOptional() @IsUUID()
  user_id?: string | null;

  @IsOptional() @IsString() @MaxLength(255)
  pending_name?: string | null;

  @IsUUID()
  role_id!: string;
}

export class CreateProjectDto {
  @IsString() @IsNotEmpty() @MaxLength(255)
  name!: string;

  @IsOptional() @IsUUID()
  parent_project_id?: string;

  @IsOptional() @IsDateString()
  start_date?: string;

  @IsOptional() @IsIn(['open', 'restricted'])
  access_control?: 'open' | 'restricted';

  @IsOptional() @IsUUID()
  status_id?: string;

  @IsOptional() @IsUUID()
  category_id?: string;

  @IsOptional() @IsUUID()
  size_id?: string;

  @IsOptional() @IsString()
  description?: string;

  @IsOptional() @IsString()
  goal?: string;

  @IsOptional() @IsString() @MaxLength(255)
  customer?: string;

  @IsOptional() @IsArray() @IsString({ each: true })
  tags?: string[];

  @IsOptional() @IsString() @MaxLength(2048)
  primary_url?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProjectMemberDto)
  members?: ProjectMemberDto[];
}