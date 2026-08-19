import { Module } from '@nestjs/common';
import { PortfolioReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { ReportsRepository } from './reports.repository';

@Module({
  controllers: [PortfolioReportsController],
  providers: [ReportsService, ReportsRepository],
})
export class ReportsModule {}
