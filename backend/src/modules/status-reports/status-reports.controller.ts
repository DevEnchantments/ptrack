import {
  Body, Controller, Get, Param, ParseUUIDPipe, Post,
} from '@nestjs/common';
import { StatusReportsService } from './status-reports.service';
import { CreateStatusReportDto } from './dto/create-status-report.dto';
import {
  CurrentUser,
  type AuthUser,
} from '../../common/decorators/current-user.decorator';

@Controller('projects/:projectId/status-reports')
export class StatusReportsController {
  constructor(private readonly reports: StatusReportsService) {}

  @Get()
  list(@Param('projectId', ParseUUIDPipe) projectId: string) {
    return this.reports.list(projectId);
  }

  @Post()
  add(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Body() dto: CreateStatusReportDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.reports.add(projectId, dto, user.id);
  }
}