import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { toHttpException } from '../../common/supabase-error';

export const ATTACHMENTS_BUCKET = 'project-attachments';

export interface Attachment {
  id: string;
  project_id: string;
  file_name: string;
  bucket: string;
  storage_path: string;
  mime_type: string | null;
  size_bytes: number | null;
  is_gold: boolean;
  description: string | null;
  tags: string[] | null;
  uploaded_by: string | null;
  created_at: string;
}

export interface AttachmentListItem extends Attachment {
  uploaded_by_profile?: {
    full_name: string | null;
    email: string | null;
  } | null;
}

export interface AttachmentDetail extends AttachmentListItem {
  project: { name: string } | null;
}

const COLUMNS =
  'id, project_id, file_name, bucket, storage_path, mime_type, size_bytes, is_gold, description, tags, uploaded_by, created_at';

const JOINS = `${COLUMNS},
  uploaded_by_profile:profiles!uploaded_by ( full_name, email )`;

@Injectable()
export class AttachmentsRepository {
  constructor(private readonly db: DatabaseService) {}

  private get table() {
    return this.db.client.from('attachments');
  }

  private get bucket() {
    return this.db.client.storage.from(ATTACHMENTS_BUCKET);
  }

  // ---- table ops ----
  async insert(row: Record<string, unknown>): Promise<AttachmentListItem> {
    const { data, error } = await this.table.insert(row).select(JOINS).single();
    if (error) throw toHttpException(error, 'attachments.insert');
    return data as unknown as AttachmentListItem;
  }

  async findByProject(projectId: string): Promise<AttachmentListItem[]> {
    const { data, error } = await this.table
      .select(JOINS)
      .eq('project_id', projectId)
      .order('is_gold', { ascending: false })
      .order('created_at', { ascending: false });
    if (error) throw toHttpException(error, 'attachments.findByProject');
    return (data ?? []) as unknown as AttachmentListItem[];
  }

  async findDetail(
    projectId: string,
    attachmentId: string,
  ): Promise<AttachmentDetail | null> {
    const { data, error } = await this.table
      .select(`${JOINS}, project:projects ( name )`)
      .eq('project_id', projectId)
      .eq('id', attachmentId)
      .maybeSingle();
    if (error) throw toHttpException(error, 'attachments.findDetail');
    return (data as unknown as AttachmentDetail) ?? null;
  }

  async findOne(
    projectId: string,
    attachmentId: string,
  ): Promise<Attachment | null> {
    const { data, error } = await this.table
      .select(COLUMNS)
      .eq('project_id', projectId)
      .eq('id', attachmentId)
      .maybeSingle();
    if (error) throw toHttpException(error, 'attachments.findOne');
    return data ?? null;
  }

  async update(
    projectId: string,
    attachmentId: string,
    patch: Record<string, unknown>,
  ): Promise<AttachmentListItem> {
    const { data, error } = await this.table
      .update(patch)
      .eq('project_id', projectId)
      .eq('id', attachmentId)
      .select(JOINS)
      .single();
    if (error) throw toHttpException(error, 'attachments.update');
    return data as unknown as AttachmentListItem;
  }

  async removeRow(projectId: string, attachmentId: string): Promise<void> {
    const { error } = await this.table
      .delete()
      .eq('project_id', projectId)
      .eq('id', attachmentId);
    if (error) throw toHttpException(error, 'attachments.removeRow');
  }

  // ---- storage ops ----
  async uploadObject(
    path: string,
    buffer: Buffer,
    contentType: string,
  ): Promise<void> {
    const { error } = await this.bucket.upload(path, buffer, {
      contentType,
      upsert: false,
    });
    if (error) {
      throw new InternalServerErrorException(`Upload failed: ${error.message}`);
    }
  }

  async signedUrl(path: string, downloadName: string): Promise<string> {
    const { data, error } = await this.bucket.createSignedUrl(path, 120, {
      download: downloadName,
    });
    if (error || !data) {
      throw new InternalServerErrorException(
        `Could not create download link: ${error?.message ?? 'unknown error'}`,
      );
    }
    return data.signedUrl;
  }

  async removeObject(path: string): Promise<void> {
    const { error } = await this.bucket.remove([path]);
    if (error) {
      throw new InternalServerErrorException(
        `Could not delete file: ${error.message}`,
      );
    }
  }
}
