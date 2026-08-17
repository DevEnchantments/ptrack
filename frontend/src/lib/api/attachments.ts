import {
  API_URL,
  apiDelete,
  apiGet,
  apiPatch,
  authHeader,
  handle,
} from './core'

// Multipart upload (FormData). Do NOT set Content-Type — the browser adds the
// multipart boundary itself. Only the Authorization header is attached.
export async function apiUpload<T>(path: string, formData: FormData): Promise<T> {
  const headers = await authHeader()
  return handle<T>(
    await fetch(`${API_URL}${path}`, {
      method: 'POST',
      headers,
      body: formData,
    }),
  )
}

export interface Attachment {
  id: string
  project_id: string
  file_name: string
  bucket: string
  storage_path: string
  mime_type: string | null
  size_bytes: number | null
  is_gold: boolean
  description: string | null
  tags: string[] | null
  parent_type: string | null
  parent_id: string | null
  uploaded_by: string | null
  created_at: string
  uploaded_by_profile?: { full_name: string | null; email: string | null } | null
}

export interface AttachmentDetail extends Attachment {
  project: { name: string } | null
}

export const attachmentsApi = {
  list: (projectId: string, parent?: { type: string; id: string }) =>
    apiGet<Attachment[]>(
      `/projects/${projectId}/attachments${
        parent ? `?parent_type=${parent.type}&parent_id=${parent.id}` : ''
      }`,
    ),
  get: (projectId: string, attachmentId: string) =>
    apiGet<AttachmentDetail>(
      `/projects/${projectId}/attachments/${attachmentId}`,
    ),
  upload: (projectId: string, formData: FormData) =>
    apiUpload<Attachment>(`/projects/${projectId}/attachments`, formData),
  downloadUrl: (projectId: string, attachmentId: string) =>
    apiGet<{ url: string }>(
      `/projects/${projectId}/attachments/${attachmentId}/download`,
    ),
  update: (
    projectId: string,
    attachmentId: string,
    data: Record<string, unknown>,
  ) =>
    apiPatch<Attachment>(
      `/projects/${projectId}/attachments/${attachmentId}`,
      data,
    ),
  remove: (projectId: string, attachmentId: string) =>
    apiDelete<{ deleted: boolean }>(
      `/projects/${projectId}/attachments/${attachmentId}`,
    ),
}
