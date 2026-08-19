/**
 * Public surface of the attachments module.
 *
 * ATTACHMENTS_BUCKET is deliberately NOT here: `projects.repository` imports it
 * today, but a storage bucket name is shared infrastructure rather than this
 * module's policy, so it moves to common code in B3.
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
