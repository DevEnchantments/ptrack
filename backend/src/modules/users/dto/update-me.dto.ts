import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class UpdateMeDto {
  /** Display name shown in history, notifications, and pickers. */
  @ApiProperty({ example: 'Fares Al Areefi' })
  @IsString()
  @MaxLength(120)
  full_name!: string;
}
