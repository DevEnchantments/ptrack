import { Injectable, NotFoundException } from '@nestjs/common';
import { StatusReportsRepository } from './status-reports.repository';
import { CreateStatusReportDto } from './dto/create-status-report.dto';
import { UpdateStatusReportDto } from './dto/update-status-report.dto';

@Injectable()
export class StatusReportsService {
  constructor(private readonly repo: StatusReportsRepository) {}

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
      title: dto.title.trim(),
      summary: dto.summary.trim(),
      report_date: dto.report_date,
      viewable_by: dto.viewable_by,
      editable_by: dto.editable_by,
      author_id: userId,
      created_by: userId,
      updated_by: userId,
    });
  }

  update(
    projectId: string,
    statusReportId: string,
    dto: UpdateStatusReportDto,
    userId: string,
  ) {
    const patch: Record<string, unknown> = { updated_by: userId };
    if (dto.title !== undefined) patch.title = dto.title.trim();
    if (dto.summary !== undefined) patch.summary = dto.summary.trim();
    if (dto.report_date !== undefined) patch.report_date = dto.report_date;
    if (dto.viewable_by !== undefined) patch.viewable_by = dto.viewable_by;
    if (dto.editable_by !== undefined) patch.editable_by = dto.editable_by;
    return this.repo.update(projectId, statusReportId, patch);
  }

  async remove(projectId: string, statusReportId: string) {
    const deleted = await this.repo.remove(projectId, statusReportId);
    if (!deleted) throw new NotFoundException('Status report not found.');
    return { deleted: true };
  }
}
