import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsIn,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChatMessageDto {
  @ApiProperty({ enum: ['user', 'assistant'], example: 'user' })
  @IsIn(['user', 'assistant'])
  role!: 'user' | 'assistant';

  @ApiProperty({ example: 'Which projects are off target?' })
  @IsString()
  @MaxLength(20_000)
  content!: string;
}

export class ChatRequestDto {
  @ApiProperty({
    type: [ChatMessageDto],
    description:
      'The full transcript so far, oldest first, ending with the new user ' +
      'message. The API is stateless: the client re-sends it each turn.',
  })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(60)
  @ValidateNested({ each: true })
  @Type(() => ChatMessageDto)
  messages!: ChatMessageDto[];
}
