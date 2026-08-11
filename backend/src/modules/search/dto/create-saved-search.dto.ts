import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateSavedSearchDto {
  @ApiProperty({ example: 'Screening work' })
  @IsString()
  @MinLength(1)
  @MaxLength(80)
  name!: string;

  @ApiProperty({ example: 'screening' })
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  query!: string;
}
