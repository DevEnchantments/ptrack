import {
  IsArray, IsBoolean, IsDateString, IsIn, IsNumber,
  IsOptional, IsString, IsUUID, MaxLength,
} from 'class-validator';

export class CreateMilestoneDto {
  @IsString() @MaxLength(255)
  name!: string;

  @IsDateString()
  start_date!: string;

  @IsDateString()
  due_date!: string;

  @IsIn(['open', 'closed_completed', 'not_applicable'])
  status!: 'open' | 'closed_completed' | 'not_applicable';

  @IsOptional() @IsUUID()
  role_id?: string | null;

  @IsOptional() @IsUUID()
  owner_id?: string | null;

  @IsOptional() @IsBoolean()
  is_major?: boolean;

  @IsOptional() @IsString()
  description?: string | null;

  @IsOptional() @IsArray() @IsString({ each: true })
  tags?: string[] | null;

  @IsOptional() @IsNumber()
  weightage?: number | null;

  @IsOptional() @IsNumber()
  percent_complete?: number | null;
}