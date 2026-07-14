import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
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
  @ApiBody({
    type: CreateStatusReportDto,
    examples: {
      minimal: {
        summary: 'Minimal — runs as-is (all fields required, no UUIDs)',
        value: {
          title: 'Apollo — week 28 status',
          summary: 'Schema migration on track. One open data-quality issue.',
          viewable_by: 'all',
          editable_by: 'submitter',
          report_date: '2026-07-13',
        },
      },
    },
  })
  add(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Body() dto: CreateStatusReportDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.reports.add(projectId, dto, user.id);
  }

  @Patch(':statusReportId')
  @ApiBody({
    type: UpdateStatusReportDto,
    examples: {
      partial: {
        summary: 'Partial — send only what changes',
        value: { summary: 'Cutover complete. No open issues.' },
      },
    },
  })
  update(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('statusReportId', ParseUUIDPipe) statusReportId: string,
    @Body() dto: UpdateStatusReportDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.reports.update(projectId, statusReportId, dto, user.id);
  }

  @Delete(':statusReportId')
  remove(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('statusReportId', ParseUUIDPipe) statusReportId: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.reports.remove(projectId, statusReportId, user.id);
  }
}
