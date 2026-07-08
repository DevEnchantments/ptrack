import {
  IsArray, IsIn, IsOptional, IsString, IsUUID, MaxLength,
} from 'class-validator';

export class CreateIssueDto {
  @IsString() @MaxLength(255)
  title!: string;

  @IsOptional() @IsUUID()
  role_id?: string | null;

  @IsOptional() @IsUUID()
  owner_id?: string | null;

  @IsOptional() @IsIn(['open', 'closed'])
  status?: 'open' | 'closed';

  @IsOptional() @IsUUID()
  level_id?: string | null;

  @IsOptional() @IsUUID()
  category_id?: string | null;

  @IsOptional() @IsString()
  description?: string | null;

  @IsOptional() @IsString() @MaxLength(2048)
  url?: string | null;

  @IsOptional() @IsArray() @IsString({ each: true })
  tags?: string[] | null;

  @IsOptional() @IsString()
  resolution?: string | null;
}