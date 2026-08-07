import { Loader2 } from 'lucide-react'
import { toast } from '@/lib/toast'
import { useState } from 'react'
import { submissionsApi, type Submission } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

interface Props {
  projectId: string
  submissions: Submission[]
  onChanged: () => void
}

const STATUS_CHIP: Record<string, { label: string; cls: string }> = {
  draft: {
    label: 'Draft',
    cls: 'border-transparent bg-muted text-muted-foreground',
  },
  review: {
    label: 'In Review',
    cls: 'border-status-blue-border bg-status-blue-bg text-status-blue-fg',
  },
  validated: {
    label: 'Validated',
    cls: 'border-status-blue-border bg-status-blue-bg text-status-blue-fg',
  },
  approved: {
    label: 'Approved',
    cls: 'border-status-green-border bg-status-green-bg text-status-green-fg',
  },
  returned: {
    label: 'Returned',
    cls: 'border-status-amber-border bg-status-amber-bg text-status-amber-fg',
  },
  rejected: {
    label: 'Rejected',
    cls: 'border-status-red-border bg-status-red-bg text-status-red-fg',
  },
  not_submitted: {
    label: 'Not Submitted',
    cls: 'border-transparent bg-muted text-muted-foreground',
  },
}

export function Chip({ status }: { status: string }) {
  const chip = STATUS_CHIP[status] ?? STATUS_CHIP.draft
  return (
    <span
      className={`inline-flex shrink-0 items-center whitespace-nowrap rounded-full border px-2 py-0.5 text-xs font-medium ${chip.cls}`}
    >
      {chip.label}
    </span>
  )
}

function personName(
  p: { full_name: string | null; email: string | null } | null,
): string {
  return p?.full_name || p?.email || 'Unknown'
}

/**
 * FR-14 workflow panel (UC-12/13). Routing ASSUMED per Fig 10: submit ->
 * PMO Partner validates -> Project Owner approves; the backend enforces the
 * actor only when the project person field is set.
 */
export function WorkflowPanel({ projectId, submissions, onChanged }: Props) {
  const [comment, setComment] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busyAction, setBusyAction] = useState<string | null>(null)

  const today = new Date().toISOString().slice(0, 10)
  const current = submissions.find(
    (s) =>
      s.cycle && s.cycle.period_start <= today && today <= s.cycle.period_end,
  )
  const past = submissions.filter((s) => s !== current)
  const cycleName = new Date().toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })

  async function run(action: string, fn: () => Promise<unknown>) {
    setError(null)
    setBusyAction(action)
    try {
      await fn()
      setComment('')
      toast.success(`Submission ${action} done.`)
      onChanged()
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setBusyAction(null)
    }
  }

  const canSubmit =
    !current || current.status === 'draft' || current.status === 'returned'
  const canValidate = current?.status === 'review'
  const canApprove = current?.status === 'validated'
  const canReturn =
    current?.status === 'review' || current?.status === 'validated'

  const actionButton = (
    label: string,
    action: string,
    onClick: () => Promise<unknown>,
    variant: 'default' | 'outline' = 'default',
  ) => (
    <Button
      key={action}
      size="sm"
      variant={variant}
      disabled={busyAction !== null}
      onClick={() => void run(action, onClick)}
    >
      {busyAction === action && <Loader2 className="animate-spin" />}
      {label}
    </Button>
  )

  return (
    <div className="mb-4 rounded-lg border bg-card p-4 shadow-xs">
      <h2 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Reporting Cycle
      </h2>

      <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm font-medium">
          {current?.cycle?.name ?? cycleName}
        </span>
        {current ? (
          <Chip status={current.status} />
        ) : (
          <span className="text-xs text-muted-foreground">Not submitted</span>
        )}
      </div>

      {current && (
        <div className="mt-2 flex flex-col gap-1 text-xs text-muted-foreground">
          {current.submitted_at && (
            <span>
              Submitted by {personName(current.submitter)} ·{' '}
              {current.submitted_at.slice(0, 10)}
            </span>
          )}
          {current.validated_at && (
            <span>
              Validated by {personName(current.validator)} ·{' '}
              {current.validated_at.slice(0, 10)}
            </span>
          )}
          {current.approved_at && (
            <span>
              Approved by {personName(current.approver)} ·{' '}
              {current.approved_at.slice(0, 10)}
            </span>
          )}
          {current.returned_at && current.status === 'returned' && (
            <span>
              Returned by {personName(current.returner)} ·{' '}
              {current.returned_at.slice(0, 10)}
            </span>
          )}
          {current.decision_comment && (
            <span className="italic">"{current.decision_comment}"</span>
          )}
        </div>
      )}

      {(canSubmit || canValidate || canApprove) && (
        <Textarea
          rows={2}
          className="mt-3"
          placeholder="Optional comment…"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      )}

      <div className="mt-3 flex flex-wrap gap-2">
        {canSubmit &&
          actionButton(
            current?.status === 'returned' ? 'Resubmit' : 'Submit for Review',
            'submit',
            () => submissionsApi.submit(projectId, comment),
          )}
        {canValidate &&
          actionButton('Validate', 'validate', () =>
            submissionsApi.act(projectId, current!.id, 'validate', comment),
          )}
        {canApprove &&
          actionButton('Approve', 'approve', () =>
            submissionsApi.act(projectId, current!.id, 'approve', comment),
          )}
        {canReturn && (
          <>
            {actionButton(
              'Return',
              'return',
              () => submissionsApi.act(projectId, current!.id, 'return', comment),
              'outline',
            )}
            {actionButton(
              'Reject',
              'reject',
              () => submissionsApi.act(projectId, current!.id, 'reject', comment),
              'outline',
            )}
          </>
        )}
      </div>

      {error &&
        (error.startsWith('Submission blocked:') ? (
          <div className="hint-in mt-2 text-xs text-destructive">
            <p className="font-medium">Submission blocked:</p>
            <ul className="mt-1 list-inside list-disc">
              {error
                .replace('Submission blocked: ', '')
                .replace(/\.$/, '')
                .split('; ')
                .map((item) => (
                  <li key={item}>{item}</li>
                ))}
            </ul>
          </div>
        ) : (
          <p className="hint-in mt-2 text-xs font-medium text-destructive">
            {error}
          </p>
        ))}

      {past.length > 0 && (
        <ul className="mt-4 flex flex-col gap-1.5 border-t pt-3">
          {past.slice(0, 6).map((s) => (
            <li
              key={s.id}
              className="flex items-center justify-between gap-2 text-xs text-muted-foreground"
            >
              <span className="min-w-0 truncate">{s.cycle?.name ?? 'Cycle'}</span>
              <Chip status={s.status} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
