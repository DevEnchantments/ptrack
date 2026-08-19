import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RecordHistoryService } from '../../database/record-history.service';
import { UpdatesRepository } from './updates.repository';
import { CreateUpdateDto } from './dto/create-update.dto';
import { UpdateUpdateDto } from './dto/update-update.dto';
import { columnsFrom, type ColumnSpec } from '../../common/columns';

/** How an update DTO maps onto columns, for both create and edit. */
const COLUMN_SPEC: ColumnSpec = {
  trimmed: ['body'],
  nullable: ['type_id'],
  arrayOrNull: ['tags'],
  asIs: ['is_gold'],
};

/** What a new update gets for the columns the caller omitted. */
const CREATE_DEFAULTS = { type_id: null, is_gold: false, tags: null };

@Injectable()
export class UpdatesService {
  constructor(
    private readonly repo: UpdatesRepository,
    private readonly auditLog: RecordHistoryService,
  ) {}

  list(projectId: string, page?: { limit?: number; offset?: number }) {
    return this.repo.findByProject(projectId, page);
  }

  add(projectId: string, dto: CreateUpdateDto, userId: string) {
    if (!dto.body?.trim()) {
      throw new BadRequestException('An update is required.');
    }
    return this.repo.insert({
      project_id: projectId,
      ...CREATE_DEFAULTS,
      ...columnsFrom(dto, COLUMN_SPEC),
      // Who wrote it: a domain field, not one of the audit columns below.
      author_id: userId,
      created_by: userId,
      updated_by: userId,
    });
  }

  async update(
    projectId: string,
    updateId: string,
    dto: UpdateUpdateDto,
    userId: string,
  ) {
    const updated = await this.repo.update(projectId, updateId, {
      updated_by: userId,
      ...columnsFrom(dto, COLUMN_SPEC),
    });
    if (!updated) throw new NotFoundException('Update not found.');
    return updated;
  }

  async remove(projectId: string, updateId: string, userId: string) {
    const deleted = await this.repo.remove(projectId, updateId);
    if (!deleted) throw new NotFoundException('Update not found.');
    await this.auditLog.logDeleted({
      table: 'updates',
      recordId: deleted.id,
      projectId,
      label: deleted.label,
      userId,
    });
    return { deleted: true };
  }
}
