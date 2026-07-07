import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name!: string;

  @IsOptional() @IsUUID()
  parent_project_id?: string;

  @IsOptional() @IsDateString()
  start_date?: string;

  @IsOptional() @IsString()
  description?: string;

  @IsOptional() @IsUUID()
  owner_id?: string;

  @IsOptional() @IsString() @MaxLength(255)
  sponsor?: string;

  @IsOptional() @IsUUID()
  status_id?: string;

  @IsOptional() @IsUUID()
  size_id?: string;

  @IsOptional() @IsUUID()
  deal_type_id?: string;

  @IsOptional() @IsUUID()
  region_id?: string;

  @IsOptional() @IsUUID()
  country_id?: string;

  @IsOptional() @IsDateString()
  target_end_date?: string;

  @IsOptional() @IsDateString()
  actual_end_date?: string;
}