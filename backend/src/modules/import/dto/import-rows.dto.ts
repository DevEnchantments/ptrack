import { ApiProperty } from '@nestjs/swagger';
import { ArrayMaxSize, ArrayMinSize, IsArray } from 'class-validator';

export class ImportRowsDto {
  @ApiProperty({
    description:
      'Column-mapped rows: {field: rawValue}. The server resolves lookup names, dates, and numbers.',
    example: [{ name: 'Imported Project A', status: 'In Progress' }],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(500)
  rows!: Array<Record<string, string>>;
}
