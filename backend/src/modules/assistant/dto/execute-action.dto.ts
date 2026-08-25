import { IsObject, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ExecuteActionDto {
  @ApiProperty({ example: 'add_update', description: 'Write-tool name.' })
  @IsString()
  @MaxLength(64)
  tool!: string;

  @ApiProperty({
    description:
      'The tool input the confirmation card carried, echoed back verbatim.',
    example: { project_id: '...', body: 'Steering committee held.' },
  })
  @IsObject()
  input!: Record<string, string>;
}
