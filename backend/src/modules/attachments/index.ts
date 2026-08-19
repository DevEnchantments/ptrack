/**
 * Public surface of the attachments module.
 *
 * ATTACHMENTS_BUCKET is deliberately not here. Two modules write to that
 * bucket, so the name lives in `common/storage.ts` as shared infrastructure
 * rather than being re-exported as this module's policy (B3).
 */
export { AttachmentsService } from './attachments.service';
export type { UploadedFileLike } from './attachments.service';
export type {
  Attachment,
  AttachmentDetail,
  AttachmentListItem,
  AttachmentParent,
  AttachmentParentType,
} from './attachments.repository';
