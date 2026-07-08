import { Injectable } from '@nestjs/common';
import { StatusReportsRepository } from './status-reports.repository';
import { CreateStatusReportDto } from './dto/create-status-report.dto';

@Injectable()
export class StatusReportsService {
  constructor(private readonly repo: StatusReportsRepository) {}

  list(projectId: string) {
    return this.repo.findByProject(projectId);
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
}