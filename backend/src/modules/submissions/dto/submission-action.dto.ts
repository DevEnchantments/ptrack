import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

/** Body for submit/validate/approve/return/reject actions. */
export class SubmissionActionDto {
  @ApiPropertyOptional({
    example: 'August figures updated; two milestones closed.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  comment?: string | null;
}
