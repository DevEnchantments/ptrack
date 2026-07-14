import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

/**
 * Opt-in pagination for list endpoints. Omitting both params returns all rows
 * (the pre-pagination behaviour), so existing clients keep working; new
 * callers pass ?limit=&offset= to page.
 */
export class PaginationQueryDto {
  @ApiPropertyOptional({
    example: 50,
    description: 'Max rows to return (1–200). Omit to return all rows.',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(200)
  limit?: number;

  @ApiPropertyOptional({
    example: 0,
    description: 'Rows to skip before the first result. Only used with limit.',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset?: number;
}
