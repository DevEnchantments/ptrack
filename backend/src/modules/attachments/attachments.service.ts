import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { RecordHistoryService } from '../../database/record-history.service';
import {
  AttachmentsRepository,
  type AttachmentParent,
  type AttachmentParentType,
} from './attachments.repository';
import { ATTACHMENTS_BUCKET } from '../../common/storage';
import { columnsFrom, type ColumnSpec } from '../../common/columns';

/** The three columns an attachment's metadata edit may touch. */
const COLUMN_SPEC: ColumnSpec = {
  trimmedOrNull: ['description'],
  arrayOrNull: ['tags'],
  asIs: ['is_gold'],
};

/**
 * An upload arrives as multipart, so every field is a string: `is_gold` is the
 * text "true" or "1", and tags are one comma-separated value. Decoding that is
 * a transport detail, kept apart from the rest of create() and away from the
 * JSON path, where the same fields arrive already typed.
 */
function parseUploadBody(body: Record<string, string>): {
  is_gold: boolean;
  description: string | null;
  tags: string[] | null;
} {
  const tags = body.tags
    ? body.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)
    : null;
  return {
    is_gold: body.is_gold === 'true' || body.is_gold === '1',
    description: body.description?.trim() || null,
    tags: tags && tags.length ? tags : null,
  };
}

/** Object key for a new upload: project-scoped, collision-proof, safe-named. */
function storagePathFor(projectId: string, originalName: string): string {
  return `${projectId}/${randomUUID()}-${safeName(originalName)}`;
}
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

    const storagePath = storagePathFor(projectId, file.originalname);
    await this.repo.uploadObject(
      storagePath,
      file.buffer,
      file.mimetype || 'application/octet-stream',
    );

    return this.repo.insert({
      project_id: projectId,
      file_name: file.originalname,
      bucket: ATTACHMENTS_BUCKET,
      storage_path: storagePath,
      mime_type: file.mimetype || null,
      size_bytes: file.size,
      ...parseUploadBody(body),
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

  async update(
    projectId: string,
    attachmentId: string,
    dto: UpdateAttachmentDto,
  ) {
    const updated = await this.repo.update(
      projectId,
      attachmentId,
      columnsFrom(dto, COLUMN_SPEC),
    );
    if (!updated) throw new NotFoundException('Attachment not found.');
    return updated;
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
