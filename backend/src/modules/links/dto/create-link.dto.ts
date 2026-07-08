import {
  IsArray, IsBoolean, IsOptional, IsString, Matches, MaxLength,
} from 'class-validator';

export class CreateLinkDto {
  @IsString()
  @MaxLength(2048)
  @Matches(/^https?:\/\//, {
    message: 'URL must start with http:// or https://',
  })
  url!: string;

  @IsOptional() @IsString() @MaxLength(255)
  label?: string | null;

  @IsOptional() @IsString()
  description?: string | null;

  @IsOptional() @IsBoolean()
  is_gold?: boolean;

  @IsOptional() @IsArray() @IsString({ each: true })
  tags?: string[] | null;
}