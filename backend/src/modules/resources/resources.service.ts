import { Injectable, NotFoundException } from '@nestjs/common';
import { RecordHistoryService } from '../../database/record-history.service';
import { ResourcesRepository } from './resources.repository';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { columnsFrom, type ColumnSpec } from '../../common/columns';

/**
 * How a resource DTO maps onto columns, for both create and update.
 * `type_id` is `asIs` rather than `nullable`: it is required on create and the
 * DTO does not admit null, so there is nothing to coerce.
 */
const COLUMN_SPEC: ColumnSpec = {
  trimmed: ['name'],
  trimmedOrNull: ['description'],
  asIs: ['type_id'],
};

/** What a new resource gets for the column the caller omitted. */
const CREATE_DEFAULTS = { description: null };

@Injectable()
export class ResourcesService {
  constructor(
    private readonly repo: ResourcesRepository,
    private readonly auditLog: RecordHistoryService,
  ) {}

  list(projectId: string) {
    return this.repo.findByProject(projectId);
  }

  add(projectId: string, dto: CreateResourceDto, userId: string) {
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
    resourceId: string,
    dto: UpdateResourceDto,
    userId: string,
  ) {
    const updated = await this.repo.update(projectId, resourceId, {
      updated_by: userId,
      ...columnsFrom(dto, COLUMN_SPEC),
    });
    if (!updated) throw new NotFoundException('Resource not found.');
    return updated;
  }

  async remove(projectId: string, resourceId: string, userId: string) {
    const deleted = await this.repo.remove(projectId, resourceId);
    if (!deleted) throw new NotFoundException('Resource not found.');
    await this.auditLog.logDeleted({
      table: 'resources',
      recordId: deleted.id,
      projectId,
      label: deleted.label,
      userId,
    });
    return { deleted: true };
  }
}
