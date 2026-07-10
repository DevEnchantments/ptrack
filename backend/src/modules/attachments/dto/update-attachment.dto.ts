import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateAttachmentDto {
  @IsOptional() @IsBoolean()
  is_gold?: boolean;

  @IsOptional() @IsString()
  description?: string | null;

  @IsOptional() @IsArray() @IsString({ each: true })
  tags?: string[] | null;
}