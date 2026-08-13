import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { RecordHistoryService } from '../../database/record-history.service';
import {
  AttachmentsRepository,
  ATTACHMENTS_BUCKET,
  type AttachmentParent,
  type AttachmentParentType,
} from './attachments.repository';
import { UpdateAttachmentDto } from './dto/update-attachment.dto';

const MAX_BYTES = 100 * 1024 * 1024; // 100 MB

export interface UploadedFileLike {
  originalname: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

function safeName(name: string): string {
  return name.replace(/[^\w.-]+/g, '_').slice(0, 180) || 'file';
}

const PARENT_TYPES: AttachmentParentType[] = ['action_item', 'milestone'];

/** Both-or-neither parent fields -> a validated parent ref (or undefined). */
function parseParent(
  type: string | undefined,
  id: string | undefined,
): AttachmentParent | undefined {
  if (!type && !id) return undefined;
  if (!type || !id) {
    throw new BadRequestException(
      'parent_type and parent_id must be provided together.',
    );
  }
  if (!PARENT_TYPES.includes(type as AttachmentParentType)) {
    throw new BadRequestException(
      `parent_type must be one of: ${PARENT_TYPES.join(', ')}.`,
    );
  }
  return { type: type as AttachmentParentType, id };
}

@Injectable()
export class AttachmentsService {
  constructor(
    private readonly repo: AttachmentsRepository,
    private readonly auditLog: RecordHistoryService,
  ) {}

  list(projectId: string, parentType?: string, parentId?: string) {
    return this.repo.findByProject(
      projectId,
      parseParent(parentType, parentId),
    );
  }

  async get(projectId: string, attachmentId: string) {
    const att = await this.repo.findDetail(projectId, attachmentId);
    if (!att) throw new NotFoundException('Attachment not found.');
    return att;
  }

  async create(
    projectId: string,
    file: UploadedFileLike | undefined,
    body: Record<string, string>,
    userId: string,
  ) {
    if (!file) throw new BadRequestException('A file is required.');
    if (file.size > MAX_BYTES) {
      throw new BadRequestException('Attachments must be under 100M in size.');
    }

    // No FK backs the polymorphic parent — verify it here instead.
    const parent = parseParent(body.parent_type, body.parent_id);
    if (parent && !(await this.repo.parentExists(projectId, parent))) {
      throw new BadRequestException(
        `The ${parent.type.replace('_', ' ')} to attach to was not found in this project.`,
      );
    }

    const storagePath = `${projectId}/${randomUUID()}-${safeName(
      file.originalname,
    )}`;
    await this.repo.uploadObject(
      storagePath,
      file.buffer,
      file.mimetype || 'application/octet-stream',
    );

    const isGold = body.is_gold === 'true' || body.is_gold === '1';
    const tags = body.tags
      ? body.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean)
      : null;

    return this.repo.insert({
      project_id: projectId,
      file_name: file.originalname,
      bucket: ATTACHMENTS_BUCKET,
      storage_path: storagePath,
      mime_type: file.mimetype || null,
      size_bytes: file.size,
      is_gold: isGold,
      description: body.description?.trim() || null,
      tags: tags && tags.length ? tags : null,
      parent_type: parent?.type ?? null,
      parent_id: parent?.id ?? null,
      uploaded_by: userId,
    });
  }

  /**
   * Cascade for polymorphic parents (no FK): when a parent record is
   * deleted, its scoped attachments go too — Storage objects included, like
   * the project-delete cleanup. Best-effort per file so one stuck object
   * cannot block the parent's deletion.
   */
  async removeByParent(
    projectId: string,
    parent: AttachmentParent,
    userId: string,
  ): Promise<void> {
    const rows = await this.repo.findByProject(projectId, parent);
    for (const att of rows) {
      try {
        await this.repo.removeObject(att.storage_path);
        await this.repo.removeRow(projectId, att.id);
        await this.auditLog.logDeleted({
          table: 'attachments',
          recordId: att.id,
          projectId,
          label: att.file_name,
          userId,
        });
      } catch {
        // Logged deletion is best-effort; move on to the next file.
      }
    }
  }

  async getDownloadUrl(projectId: string, attachmentId: string) {
    const att = await this.repo.findOne(projectId, attachmentId);
    if (!att) throw new NotFoundException('Attachment not found.');
    const url = await this.repo.signedUrl(att.storage_path, att.file_name);
    return { url };
  }

  update(projectId: string, attachmentId: string, dto: UpdateAttachmentDto) {
    const patch: Record<string, unknown> = {};
    if (dto.is_gold !== undefined) patch.is_gold = dto.is_gold;
    if (dto.description !== undefined)
      patch.description = dto.description?.trim() || null;
    if (dto.tags !== undefined) patch.tags = dto.tags?.length ? dto.tags : null;
    return this.repo.update(projectId, attachmentId, patch);
  }

  async remove(projectId: string, attachmentId: string, userId: string) {
    const att = await this.repo.findOne(projectId, attachmentId);
    if (!att) throw new NotFoundException('Attachment not found.');
    await this.repo.removeObject(att.storage_path);
    await this.repo.removeRow(projectId, attachmentId);
    await this.auditLog.logDeleted({
      table: 'attachments',
      recordId: attachmentId,
      projectId,
      label: att.file_name,
      userId,
    });
    return { deleted: true };
  }
}
