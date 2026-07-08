import {
  ArrayMaxSize, IsArray, IsDateString, IsIn,
  IsOptional, IsString, IsUUID, MaxLength,
} from 'class-validator';

export class CreateActionItemDto {
  @IsString() @MaxLength(255)
  title!: string;

  @IsDateString()
  due_date!: string;

  @IsIn(['open', 'closed_completed', 'not_applicable'])
  status!: 'open' | 'closed_completed' | 'not_applicable';

  @IsOptional() @IsUUID()
  milestone_id?: string | null;

  @IsOptional() @IsUUID()
  type_id?: string | null;

  @IsOptional() @IsUUID()
  role_id?: string | null;

  @IsOptional() @IsString()
  description?: string | null;

  @IsOptional() @IsArray() @IsString({ each: true })
  tags?: string[] | null;

  @IsOptional() @IsArray() @ArrayMaxSize(4) @IsUUID('4', { each: true })
  owner_ids?: string[];
}