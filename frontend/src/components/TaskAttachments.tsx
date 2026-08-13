import { Loader2, Paperclip, Trash2, Upload } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { attachmentsApi, type Attachment } from '@/lib/api'
import { toast } from '@/lib/toast'
import { Button } from '@/components/ui/button'

interface Props {
  projectId: string
  actionItemId: string
}

function formatSize(bytes: number | null): string {
  if (bytes == null) return ''
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  if (bytes >= 1024) return `${Math.round(bytes / 1024)} KB`
  return `${bytes} B`
}

/**
 * FR-06 / Appendix A task-level attachments: files scoped to one action item
 * (they also appear in the project's Attachments section with a Task badge).
 */
export function TaskAttachments({ projectId, actionItemId }: Props) {
  const [items, setItems] = useState<Attachment[] | null>(null)
  const [uploading, setUploading] = useState(false)
  const [armedId, setArmedId] = useState<string | null>(null)
  const fileInput = useRef<HTMLInputElement>(null)

  const load = useCallback(() => {
    attachmentsApi
      .list(projectId, { type: 'action_item', id: actionItemId })
      .then(setItems)
      .catch(() => toast.error('Could not load attachments.'))
  }, [projectId, actionItemId])

  useEffect(() => {
    load()
  }, [load])

  async function upload(file: File) {
    setUploading(true)
    try {
      const form = new FormData()
      form.append('file', file)
      form.append('parent_type', 'action_item')
      form.append('parent_id', actionItemId)
      await attachmentsApi.upload(projectId, form)
      toast.success('Attachment uploaded.')
      load()
    } catch (e) {
      toast.error((e as Error).message)
    } finally {
      setUploading(false)
      if (fileInput.current) fileInput.current.value = ''
    }
  }

  function download(attachmentId: string) {
    attachmentsApi
      .downloadUrl(projectId, attachmentId)
      .then(({ url }) => window.open(url, '_blank'))
      .catch(() => toast.error('Could not get the download link.'))
  }

  async function remove(attachmentId: string) {
    try {
      await attachmentsApi.remove(projectId, attachmentId)
      toast.success('Attachment deleted.')
      setArmedId(null)
      load()
    } catch (e) {
      toast.error((e as Error).message)
    }
  }

  return (
    <section className="mt-6">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">Attachments</h2>
        <input
          ref={fileInput}
          type="file"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0]
            if (f) void upload(f)
          }}
        />
        <Button
          variant="outline"
          size="sm"
          disabled={uploading}
          onClick={() => fileInput.current?.click()}
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
          {uploading ? 'Uploading…' : 'Upload file'}
        </Button>
      </div>

      {!items || items.length === 0 ? (
        <div className="rounded-md border border-dashed px-4 py-5 text-sm text-muted-foreground">
          {items === null ? 'Loading…' : 'No files attached to this task yet.'}
        </div>
      ) : (
        <ul className="divide-y rounded-md border bg-card">
          {items.map((a) => (
            <li key={a.id} className="flex items-center gap-3 px-4 py-2.5">
              <Paperclip className="h-4 w-4 shrink-0 text-muted-foreground" />
              <button
                type="button"
                onClick={() => download(a.id)}
                className="min-w-0 flex-1 truncate text-left text-sm font-medium text-primary hover:underline"
                title="Download"
              >
                {a.file_name}
              </button>
              <span className="hidden whitespace-nowrap text-xs text-muted-foreground sm:inline">
                {formatSize(a.size_bytes)}
              </span>
              <span className="hidden whitespace-nowrap text-xs text-muted-foreground md:inline">
                {a.created_at.slice(0, 10)}
              </span>
              {armedId === a.id ? (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => void remove(a.id)}
                >
                  Confirm delete
                </Button>
              ) : (
                <button
                  type="button"
                  aria-label={`Delete ${a.file_name}`}
                  onClick={() => setArmedId(a.id)}
                  className="cursor-pointer rounded p-1 text-muted-foreground hover:text-destructive focus-visible:outline-2 focus-visible:outline-ring"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
