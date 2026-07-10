import {
  Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post,
} from '@nestjs/common';
import { StatusReportsService } from './status-reports.service';
import { CreateStatusReportDto } from './dto/create-status-report.dto';
import { UpdateStatusReportDto } from './dto/update-status-report.dto';
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

  @Get(':statusReportId')
  get(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('statusReportId', ParseUUIDPipe) statusReportId: string,
  ) {
    return this.reports.get(projectId, statusReportId);
  }

  @Post()
  add(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Body() dto: CreateStatusReportDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.reports.add(projectId, dto, user.id);
  }

  @Patch(':statusReportId')
  update(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('statusReportId', ParseUUIDPipe) statusReportId: string,
    @Body() dto: UpdateStatusReportDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.reports.update(projectId, statusReportId, dto, user.id);
  }
}