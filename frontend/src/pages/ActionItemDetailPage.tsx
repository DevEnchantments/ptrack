import { toast } from '@/lib/toast'
import { useCallback, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  actionItemsApi,
  type ActionItem,
  type ActionItemComment,
} from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { AddActionItemDialog } from '@/components/AddActionItemDialog'
import { MiniCalendar } from '@/components/MiniCalendar'
import { RecordHistory } from '@/components/RecordHistory'

const STATUS_LABELS: Record<string, string> = {
  open: 'Open',
  closed_completed: 'Closed / Completed',
  not_applicable: 'Not Applicable',
}

const TABS = ['Show All', 'Comments', 'History'] as const
type Tab = (typeof TABS)[number]

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  if (value === null || value === undefined || value === '') return null
  return (
    <div className="grid grid-cols-3 gap-4 border-b px-1 py-3 last:border-0">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="col-span-2 text-sm">{value}</dd>
    </div>
  )
}

function ownersLabel(item: ActionItem): string | null {
  if (!item.owners.length) return null
  return item.owners
    .slice()
    .sort((a, b) => a.slot - b.slot)
    .map((o) => o.profile?.full_name || o.profile?.email || '—')
    .join(', ')
}

function commentAuthor(c: ActionItemComment): string {
  return c.author?.full_name || c.author?.email || 'Unknown'
}

export function ActionItemDetailPage() {
  const { projectId, actionItemId } = useParams<{
    projectId: string
    actionItemId: string
  }>()
  const navigate = useNavigate()
  const [item, setItem] = useState<ActionItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tab, setTab] = useState<Tab>('Show All')
  const [editOpen, setEditOpen] = useState(false)

  const [comments, setComments] = useState<ActionItemComment[]>([])
  const [newComment, setNewComment] = useState('')
  const [posting, setPosting] = useState(false)
  const [commentError, setCommentError] = useState<string | null>(null)

  const load = useCallback(() => {
    if (!projectId || !actionItemId) return
    actionItemsApi
      .get(projectId, actionItemId)
      .then(setItem)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false))
  }, [projectId, actionItemId])

  const loadComments = useCallback(() => {
    if (!projectId || !actionItemId) return
    actionItemsApi
      .listComments(projectId, actionItemId)
      .then(setComments)
      .catch(() => toast.error('Could not load comments.'))
  }, [projectId, actionItemId])

  useEffect(() => {
    load()
    loadComments()
  }, [load, loadComments])

  async function postComment() {
    if (!projectId || !actionItemId) return
    const body = newComment.trim()
    if (!body) return
    setCommentError(null)
    setPosting(true)
    try {
      await actionItemsApi.addComment(projectId, actionItemId, body)
      setNewComment('')
      loadComments()
    } catch (e) {
      setCommentError((e as Error).message)
    } finally {
      setPosting(false)
    }
  }

  if (loading) {
    return <div className="p-6 text-muted-foreground">Loading…</div>
  }
  if (error || !item) {
    return (
      <div className="p-6">
        <p className="text-destructive">{error ?? 'Action item not found.'}</p>
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

  const showComments = tab === 'Show All' || tab === 'Comments'
  const showHistory = tab === 'Show All' || tab === 'History'

  return (
    <div className="min-h-svh">
      <header className="border-b px-6 py-4">
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
          {item.project?.name ?? 'Project'}
        </button>
        <span className="mx-2 text-muted-foreground">/</span>
        <span className="text-sm">Action Item</span>
      </header>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 p-6 lg:grid-cols-[1fr_240px]">
        <div>
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Action Item</h1>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditOpen(true)}
          >
            Edit Action Item
          </Button>
        </div>

        <dl className="rounded-md border px-4">
          <Field label="Action" value={item.title} />
          <Field label="Milestone" value={item.milestone?.name ?? null} />
          <Field label="Type" value={item.type?.name ?? null} />
          <Field label="Assigned Role" value={item.role?.name ?? null} />
          <Field
            label="Status"
            value={STATUS_LABELS[item.status] ?? item.status}
          />
          <Field label="Due Date" value={item.due_date} />
          <Field label="Owner(s)" value={ownersLabel(item)} />
          <Field label="Description" value={item.description} />
          <Field
            label="Tags"
            value={item.tags?.length ? item.tags.join(', ') : null}
          />
        </dl>

        <div className="mt-6 flex gap-6 border-b">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={
                'border-b-2 pb-2 text-sm ' +
                (tab === t
                  ? 'border-primary font-medium'
                  : 'border-transparent text-muted-foreground hover:text-foreground')
              }
            >
              {t}
            </button>
          ))}
        </div>

        {showComments && (
          <section className="mt-6">
            <h2 className="mb-3 text-lg font-semibold">Comments</h2>

            <div className="mb-4 flex flex-col gap-2 rounded-md border p-4">
              <Textarea
                rows={3}
                placeholder="Add a comment…"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              {commentError && (
                <p className="text-sm text-destructive">{commentError}</p>
              )}
              <div className="flex justify-end">
                <Button
                  size="sm"
                  onClick={postComment}
                  disabled={posting || !newComment.trim()}
                >
                  {posting ? 'Adding…' : 'Add Comment'}
                </Button>
              </div>
            </div>

            {comments.length === 0 ? (
              <p className="text-sm text-muted-foreground">No comments found.</p>
            ) : (
              <ul className="divide-y rounded-md border">
                {comments.map((c) => (
                  <li key={c.id} className="px-4 py-3">
                    <div className="mb-1 flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">
                        {commentAuthor(c)}
                      </span>
                      <span>·</span>
                      <span>{new Date(c.created_at).toLocaleString()}</span>
                    </div>
                    <p className="whitespace-pre-wrap text-sm">{c.body}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {showHistory && (
          <section className="mt-6">
            <h2 className="mb-3 text-lg font-semibold">History</h2>
            <RecordHistory
              recordNoun="action item"
              refreshKey={item.updated_at}
              load={() => actionItemsApi.history(projectId!, actionItemId!)}
            />
          </section>
        )}
        </div>

        <aside className="flex flex-col gap-4">
          <MiniCalendar label="Due Date" date={item.due_date} />
        </aside>
      </div>

      <AddActionItemDialog
        projectId={projectId!}
        open={editOpen}
        onOpenChange={setEditOpen}
        existing={item}
        onSaved={load}
        onDeleted={() => navigate(`/projects/${projectId}`)}
      />
    </div>
  )
}