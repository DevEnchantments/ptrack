import { Injectable, NotFoundException } from '@nestjs/common';
import { RecordHistoryService } from '../../database/record-history.service';
import { StatusReportsRepository } from './status-reports.repository';
import { CreateStatusReportDto } from './dto/create-status-report.dto';
import { UpdateStatusReportDto } from './dto/update-status-report.dto';
import { columnsFrom, type ColumnSpec } from '../../common/columns';

/**
 * How a status-report DTO maps onto columns, for both create and update.
 * Every create column is required, so there are no CREATE_DEFAULTS.
 */
const COLUMN_SPEC: ColumnSpec = {
  trimmed: ['title', 'summary'],
  asIs: ['report_date', 'viewable_by', 'editable_by'],
};

@Injectable()
export class StatusReportsService {
  constructor(
    private readonly repo: StatusReportsRepository,
    private readonly auditLog: RecordHistoryService,
  ) {}

  list(projectId: string) {
    return this.repo.findByProject(projectId);
  }

  async get(projectId: string, statusReportId: string) {
    const report = await this.repo.findOne(projectId, statusReportId);
    if (!report) throw new NotFoundException('Status report not found.');
    return report;
  }

  add(projectId: string, dto: CreateStatusReportDto, userId: string) {
    return this.repo.insert({
      project_id: projectId,
      ...columnsFrom(dto, COLUMN_SPEC),
      // Who wrote the report — a domain field, not one of the audit columns
      // below, even though a create sets all three to the same user.
      author_id: userId,
      created_by: userId,
      updated_by: userId,
    });
  }

  async update(
    projectId: string,
    statusReportId: string,
    dto: UpdateStatusReportDto,
    userId: string,
  ) {
    const updated = await this.repo.update(projectId, statusReportId, {
      updated_by: userId,
      ...columnsFrom(dto, COLUMN_SPEC),
    });
    if (!updated) throw new NotFoundException('Status report not found.');
    return updated;
  }

  async remove(projectId: string, statusReportId: string, userId: string) {
    const deleted = await this.repo.remove(projectId, statusReportId);
    if (!deleted) throw new NotFoundException('Status report not found.');
    await this.auditLog.logDeleted({
      table: 'status_reports',
      recordId: deleted.id,
      projectId,
      label: deleted.label,
      userId,
    });
    return { deleted: true };
  }
}
