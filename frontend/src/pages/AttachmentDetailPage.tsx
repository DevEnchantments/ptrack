import { toast } from '@/lib/toast'
import { useCallback, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { attachmentsApi, type AttachmentDetail } from '@/lib/api'
import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'

function uploaderName(
  a: { full_name: string | null; email: string | null } | null | undefined,
) {
  return a?.full_name || a?.email || 'Unknown'
}

function formatSize(bytes: number | null): string {
  if (bytes == null) return ''
  if (bytes === 0) return '0'
  if (bytes < 1024) return `${bytes}B`
  const kb = bytes / 1024
  if (kb < 1024) return `${Math.round(kb)}KB`
  const mb = kb / 1024
  if (mb < 1024) return `${Math.round(mb)}MB`
  return `${(mb / 1024).toFixed(1)}GB`
}

function relativeTime(iso: string): string {
  const sec = Math.round((Date.now() - new Date(iso).getTime()) / 1000)
  if (sec < 60) return `${sec} second${sec === 1 ? '' : 's'} ago`
  const min = Math.round(sec / 60)
  if (min < 60) return `${min} minute${min === 1 ? '' : 's'} ago`
  const hr = Math.round(min / 60)
  if (hr < 24) return `${hr} hour${hr === 1 ? '' : 's'} ago`
  const day = Math.round(hr / 24)
  if (day < 30) return `${day} day${day === 1 ? '' : 's'} ago`
  const mo = Math.round(day / 30)
  if (mo < 12) return `${mo} month${mo === 1 ? '' : 's'} ago`
  return `${Math.round(mo / 12)} year${Math.round(mo / 12) === 1 ? '' : 's'} ago`
}

function longDate(iso: string): string {
  const d = new Date(iso)
  if (isNaN(d.getTime())) return iso
  const weekday = d.toLocaleDateString('en-US', { weekday: 'long' })
  const month = d.toLocaleDateString('en-US', { month: 'long' })
  return `${weekday}, ${d.getDate()} ${month}, ${d.getFullYear()}`
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid grid-cols-3 gap-4 border-b px-1 py-3 last:border-0">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="col-span-2 text-sm">{value}</dd>
    </div>
  )
}

export function AttachmentDetailPage() {
  const { projectId, attachmentId } = useParams<{
    projectId: string
    attachmentId: string
  }>()
  const navigate = useNavigate()
  const [att, setAtt] = useState<AttachmentDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(() => {
    if (!projectId || !attachmentId) return
    attachmentsApi
      .get(projectId, attachmentId)
      .then(setAtt)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false))
  }, [projectId, attachmentId])

  useEffect(() => {
    load()
  }, [load])

  function download() {
    if (!projectId || !attachmentId) return
    attachmentsApi
      .downloadUrl(projectId, attachmentId)
      .then(({ url }) => window.open(url, '_blank'))
      .catch(() => toast.error('Could not get the download link.'))
  }

  if (loading) {
    return <div className="p-6 text-muted-foreground">Loading…</div>
  }
  if (error || !att) {
    return (
      <div className="p-6">
        <p className="text-destructive">{error ?? 'Attachment not found.'}</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => navigate(`/projects/${projectId}`)}
        >
          Back to project
        </Button>
      </div>
    )
  }

  const projectName = att.project?.name ?? 'Project'

  return (
    <div className="min-h-svh">
      <header className="flex items-center justify-between border-b px-6 py-4">
        <div>
          <button
            onClick={() => navigate('/')}
            className="text-sm text-muted-foreground hover:underline"
          >
            Projects
          </button>
          <span className="mx-2 text-muted-foreground">/</span>
          <button
            onClick={() => navigate(`/projects/${projectId}`)}
            className="text-sm text-muted-foreground hover:underline"
          >
            {projectName}
          </button>
          <h1 className="mt-1 text-2xl font-semibold">Attachment</h1>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(`/projects/${projectId}`)}
        >
          View Project Details
        </Button>
      </header>

      <div className="mx-auto max-w-3xl p-6">
        <div className="rounded-lg border p-8">
          <div className="mb-6 flex flex-col items-center">
            <Download className="h-12 w-12 text-primary" />
            <h2 className="mt-4 text-center text-xl font-semibold break-all">
              {att.file_name}
            </h2>
          </div>

          <dl className="rounded-md border px-4">
            <Row label="File Name" value={att.file_name} />
            <Row label="Size" value={formatSize(att.size_bytes)} />
            <Row label="Description" value={att.description || '-'} />
            <Row
              label="Created By"
              value={uploaderName(att.uploaded_by_profile)}
            />
            <Row label="Created" value={relativeTime(att.created_at)} />
            <Row label="Created Date" value={longDate(att.created_at)} />
          </dl>

          <div className="mt-6 flex justify-center">
            <Button onClick={download} className="gap-2">
              <Download className="h-4 w-4" />
              Download
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}