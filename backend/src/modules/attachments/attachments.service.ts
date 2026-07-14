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

@Injectable()
export class AttachmentsService {
  constructor(
    private readonly repo: AttachmentsRepository,
    private readonly auditLog: RecordHistoryService,
  ) {}

  list(projectId: string) {
    return this.repo.findByProject(projectId);
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
      uploaded_by: userId,
    });
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
