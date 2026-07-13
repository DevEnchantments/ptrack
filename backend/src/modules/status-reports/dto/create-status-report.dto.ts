import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsIn, IsString, MaxLength } from 'class-validator';

export class CreateStatusReportDto {
  @ApiProperty({ example: 'Apollo — week 28 status' })
  @IsString()
  @MaxLength(255)
  title!: string;

  @ApiProperty({
    example: 'Schema migration on track. One open data-quality issue.',
  })
  @IsString()
  summary!: string;

  @ApiProperty({
    enum: ['submitter', 'submitter_and_members', 'all'],
    example: 'all',
  })
  @IsIn(['submitter', 'submitter_and_members', 'all'])
  viewable_by!: 'submitter' | 'submitter_and_members' | 'all';

  @ApiProperty({
    enum: ['submitter', 'submitter_and_members', 'all_contributors'],
    example: 'submitter',
  })
  @IsIn(['submitter', 'submitter_and_members', 'all_contributors'])
  editable_by!: 'submitter' | 'submitter_and_members' | 'all_contributors';

  @ApiProperty({ format: 'date', example: '2026-07-13' })
  @IsDateString()
  report_date!: string;
}
