import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { ReportsService } from './reports.service';
import {
  CurrentUser,
  type AuthUser,
} from '../../common/decorators/current-user.decorator';

/**
 * FR-12 named portfolio reports. Shares the `/reports` prefix with the
 * submissions module's cycle-status route — paths are distinct.
 */
@Controller('reports')
export class PortfolioReportsController {
  constructor(private readonly reports: ReportsService) {}

  @Get('initiative-progress')
  initiativeProgress(@CurrentUser() user: AuthUser) {
    return this.reports.initiativeProgress(user.id);
  }

  @Get('monthly-performance')
  monthlyPerformance(
    @CurrentUser() user: AuthUser,
    @Query('year', new ParseIntPipe({ optional: true })) year?: number,
  ) {
    return this.reports.monthlyPerformance(
      year ?? new Date().getFullYear(),
      user.id,
    );
  }
}
