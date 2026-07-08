import {
  IsArray, IsBoolean, IsOptional, IsString, IsUUID,
} from 'class-validator';

export class CreateUpdateDto {
  @IsString()
  body!: string;

  @IsOptional() @IsUUID()
  type_id?: string | null;

  @IsOptional() @IsBoolean()
  is_gold?: boolean;

  @IsOptional() @IsArray() @IsString({ each: true })
  tags?: string[] | null;
}   