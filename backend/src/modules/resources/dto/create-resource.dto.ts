import { IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateResourceDto {
  @IsString() @MaxLength(255)
  name!: string;

  @IsUUID()
  type_id!: string;

  @IsOptional() @IsString()
  description?: string | null;
}