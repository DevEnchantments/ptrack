import { Injectable, NotFoundException } from '@nestjs/common';
import { RecordHistoryService } from '../../database/record-history.service';
import { LinksRepository } from './links.repository';
import { CreateLinkDto } from './dto/create-link.dto';
import { UpdateLinkDto } from './dto/update-link.dto';

/**
 * The single definition of how a link DTO maps onto columns. Only keys that
 * were actually sent appear, so the same function serves create (spread over
 * CREATE_DEFAULTS) and patch (spread onto updated_by) — create and update
 * cannot drift apart on trimming or null-collapsing.
 */
function columnsFrom(dto: Partial<CreateLinkDto>): Record<string, unknown> {
  const cols: Record<string, unknown> = {};
  if (dto.url !== undefined) cols.url = dto.url.trim();
  if (dto.label !== undefined) cols.label = dto.label?.trim() || null;
  if (dto.description !== undefined)
    cols.description = dto.description?.trim() || null;
  // Guarded on `!== undefined`, not truthiness, so un-starring a link reaches
  // the database.
  if (dto.is_gold !== undefined) cols.is_gold = dto.is_gold;
  if (dto.tags !== undefined) cols.tags = dto.tags?.length ? dto.tags : null;
  return cols;
}

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
      ...columnsFrom(dto),
      created_by: userId,
      updated_by: userId,
    });
  }

  update(
    projectId: string,
    linkId: string,
    dto: UpdateLinkDto,
    userId: string,
  ) {
    return this.repo.update(projectId, linkId, {
      updated_by: userId,
      ...columnsFrom(dto),
    });
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
