import { Injectable, NotFoundException } from '@nestjs/common';
import { RecordHistoryService } from '../../database/record-history.service';
import { LinksRepository } from './links.repository';
import { CreateLinkDto } from './dto/create-link.dto';
import { UpdateLinkDto } from './dto/update-link.dto';
import { columnsFrom, type ColumnSpec } from '../../common/columns';

/**
 * How a link DTO maps onto columns — one definition serving both create and
 * update, so the two cannot drift apart on trimming or null-collapsing.
 * `is_gold` is `asIs` rather than a boolean default, so un-starring a link
 * reaches the database.
 */
const COLUMN_SPEC: ColumnSpec = {
  trimmed: ['url'],
  trimmedOrNull: ['label', 'description'],
  arrayOrNull: ['tags'],
  asIs: ['is_gold'],
};

/** What a new link gets for the columns the caller omitted. */
const CREATE_DEFAULTS = {
  label: null,
  description: null,
  is_gold: false,
  tags: null,
};

@Injectable()
export class LinksService {
  constructor(
    private readonly repo: LinksRepository,
    private readonly auditLog: RecordHistoryService,
  ) {}

  list(projectId: string) {
    return this.repo.findByProject(projectId);
  }

  add(projectId: string, dto: CreateLinkDto, userId: string) {
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
    linkId: string,
    dto: UpdateLinkDto,
    userId: string,
  ) {
    const updated = await this.repo.update(projectId, linkId, {
      updated_by: userId,
      ...columnsFrom(dto, COLUMN_SPEC),
    });
    if (!updated) throw new NotFoundException('Link not found.');
    return updated;
  }

  async remove(projectId: string, linkId: string, userId: string) {
    const deleted = await this.repo.remove(projectId, linkId);
    if (!deleted) throw new NotFoundException('Link not found.');
    await this.auditLog.logDeleted({
      table: 'links',
      recordId: deleted.id,
      projectId,
      label: deleted.label,
      userId,
    });
    return { deleted: true };
  }
}
