import { Injectable, NotFoundException } from '@nestjs/common';
import { RecordHistoryService } from '../../database/record-history.service';
import { IssuesRepository } from './issues.repository';
import { CreateIssueDto } from './dto/create-issue.dto';
import { UpdateIssueDto } from './dto/update-issue.dto';
import { columnsFrom, type ColumnSpec } from '../../common/columns';

/** How an issue DTO maps onto columns, for both create and update. */
const COLUMN_SPEC: ColumnSpec = {
  trimmed: ['title'],
  trimmedOrNull: [
    'description',
    'url',
    'reference_identifier',
    'resolution',
    'recommendation',
    'reported_by',
  ],
  nullable: ['role_id', 'owner_id', 'level_id', 'category_id'],
  dateOrNull: ['date_closed'],
  arrayOrNull: ['tags'],
  asIs: ['status'],
};

/** What a new issue gets for the columns the caller omitted. */
const CREATE_DEFAULTS = {
  role_id: null,
  owner_id: null,
  status: 'open',
  level_id: null,
  category_id: null,
  description: null,
  url: null,
  reference_identifier: null,
  tags: null,
  resolution: null,
  recommendation: null,
  reported_by: null,
  date_closed: null,
};

@Injectable()
export class IssuesService {
  constructor(
    private readonly repo: IssuesRepository,
    private readonly auditLog: RecordHistoryService,
  ) {}

  list(projectId: string) {
    return this.repo.findByProject(projectId);
  }

  add(projectId: string, dto: CreateIssueDto, userId: string) {
    return this.repo.insert({
      project_id: projectId,
      ...CREATE_DEFAULTS,
      ...columnsFrom(dto, COLUMN_SPEC),
      created_by: userId,
      updated_by: userId,
    });
  }

  async update(
    projectId: string,
    issueId: string,
    dto: UpdateIssueDto,
    userId: string,
  ) {
    const updated = await this.repo.update(projectId, issueId, {
      updated_by: userId,
      ...columnsFrom(dto, COLUMN_SPEC),
    });
    if (!updated) throw new NotFoundException('Issue not found.');
    return updated;
  }

  async remove(projectId: string, issueId: string, userId: string) {
    const deleted = await this.repo.remove(projectId, issueId);
    if (!deleted) throw new NotFoundException('Issue not found.');
    await this.auditLog.logDeleted({
      table: 'issues',
      recordId: deleted.id,
      projectId,
      label: deleted.label,
      userId,
    });
    return { deleted: true };
  }
}
