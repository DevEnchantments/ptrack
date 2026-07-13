import { Module } from '@nestjs/common';
import { StatusReportsController } from './status-reports.controller';
import { StatusReportsService } from './status-reports.service';
import { StatusReportsRepository } from './status-reports.repository';

@Module({
  controllers: [StatusReportsController],
  providers: [StatusReportsService, StatusReportsRepository],
})
export class StatusReportsModule {}
