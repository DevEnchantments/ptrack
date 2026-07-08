import { IsDateString, IsIn, IsString, MaxLength } from 'class-validator';

export class CreateStatusReportDto {
  @IsString() @MaxLength(255)
  title!: string;

  @IsString()
  summary!: string;

  @IsIn(['submitter', 'submitter_and_members', 'all'])
  viewable_by!: 'submitter' | 'submitter_and_members' | 'all';

  @IsIn(['submitter', 'submitter_and_members', 'all_contributors'])
  editable_by!: 'submitter' | 'submitter_and_members' | 'all_contributors';

  @IsDateString()
  report_date!: string;
}