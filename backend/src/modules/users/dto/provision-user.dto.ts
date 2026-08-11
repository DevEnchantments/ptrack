import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class ProvisionUserDto {
  @ApiProperty({ example: 'sara.alharbi@poc.ptrack.local' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'Sara Al-Harbi' })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  full_name!: string;

  @ApiProperty({
    example: 'Temp-9f3kQ2vx',
    description: 'Temporary password the admin hands to the person.',
  })
  @IsString()
  @MinLength(8)
  @MaxLength(72)
  password!: string;
}
