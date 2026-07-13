import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ example: 'Rollback plan drafted — awaiting review from Ops.' })
  @IsString()
  @MinLength(1)
  body!: string;
}
