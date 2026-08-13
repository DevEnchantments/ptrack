import { Module } from '@nestjs/common';
import { PortfolioReportsController } from './reports.controller';
import { ReportsService } from './reports.service';

@Module({
  controllers: [PortfolioReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
