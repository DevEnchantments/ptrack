import { useCallback, useEffect, useRef, useState } from 'react'
import { AssistantMarkdown } from '@/components/AssistantMarkdown'
import { AssistantChart } from '@/components/AssistantChart'
import { Link } from 'react-router-dom'
import {
  assistantApi,
  type AssistantAction,
  type AssistantEvent,
  type ChartSpec,
  type ChatMessage,
} from '@/lib/api'
import { useMe } from '@/lib/use-me'
import { Button } from '@/components/ui/button'
import { Bot, Check, Loader2, Search, Send, Sparkles, X } from 'lucide-react'

/** Friendly labels for the activity chips shown while the assistant works. */
const TOOL_LABELS: Record<string, string> = {
  get_me: 'Checking your profile',
  get_my_work: 'Gathering your assignments',
  search_records: 'Searching records',
  list_projects: 'Listing projects',
  get_project: 'Reading project details',
  get_project_sections: 'Reading project records',
  get_cycle_status: 'Checking the submission cycle',
  report_initiative_progress: 'Running Initiative Progress',
  report_monthly_performance: 'Running Monthly Performance',
  list_kpis: 'Reading KPIs',
  render_chart: 'Drawing a chart',
}

const SUGGESTIONS = [
  'Which projects are off target, and why?',
  'Summarize the open risks across my projects',
  "What's the status of this month's submission cycle?",
  'What is on my plate this week?',
]

type ActionState = 'pending' | 'running' | 'done' | 'failed' | 'cancelled'

interface TurnAction {
  action: AssistantAction
  state: ActionState
  note?: string
}

interface Turn {
  role: 'user' | 'assistant'
  content: string
  /** Tool activity that produced this assistant turn, in call order. */
  tools: string[]
  /** Write actions proposed in this turn, awaiting/after confirmation. */
  actions: TurnAction[]
  /** Charts the assistant drew in this turn. */
  charts: ChartSpec[]
  error?: boolean
}

export function AssistantPage() {
  const me = useMe()
  const [configured, setConfigured] = useState<boolean | null>(null)
  const [turns, setTurns] = useState<Turn[]>([])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const abortRef = useRef<AbortController | null>(null)
  const endRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    let alive = true
    assistantApi
      .status()
      .then((s) => {
        if (alive) setConfigured(s.configured)
      })
      .catch(() => {
        if (alive) setConfigured(false)
      })
    return () => {
      alive = false
      abortRef.current?.abort()
    }
  }, [])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [turns])

  const send = useCallback(
    async (text: string) => {
      const question = text.trim()
      if (!question || busy) return
      setInput('')
      setBusy(true)

      const history: ChatMessage[] = []
      for (const t of turns) {
        if (t.error) continue
        history.push({ role: t.role, content: t.content })
        for (const a of t.actions) {
          if (a.state === 'done') {
            history.push({
              role: 'user',
              content: `[I confirmed "${a.action.summary}" and it was executed successfully.]`,
            })
          } else if (a.state === 'failed') {
            history.push({
              role: 'user',
              content: `[I confirmed "${a.action.summary}" but it failed: ${a.note ?? 'unknown error'}]`,
            })
          } else if (a.state === 'cancelled') {
            history.push({
              role: 'user',
              content: `[I cancelled the proposed action "${a.action.summary}".]`,
            })
          }
        }
      }
      history.push({ role: 'user', content: question })
      setTurns((prev) => [
        ...prev,
        { role: 'user', content: question, tools: [], actions: [], charts: [] },
        { role: 'assistant', content: '', tools: [], actions: [], charts: [] },
      ])

      const patchReply = (fn: (t: Turn) => Turn) =>
        setTurns((prev) => {
          const next = [...prev]
          next[next.length - 1] = fn(next[next.length - 1])
          return next
        })

      const controller = new AbortController()
      abortRef.current = controller
      try {
        await assistantApi.chat(
          history,
          (event: AssistantEvent) => {
            if (event.type === 'text') {
              patchReply((t) => ({ ...t, content: t.content + event.delta }))
            } else if (event.type === 'tool') {
              // Prose before and after a tool call are separate paragraphs.
              patchReply((t) => ({
                ...t,
                tools: [...t.tools, event.name],
                content:
                  t.content && !t.content.endsWith('\n')
                    ? `${t.content}\n\n`
                    : t.content,
              }))
            } else if (event.type === 'chart') {
              patchReply((t) => ({ ...t, charts: [...t.charts, event.chart] }))
            } else if (event.type === 'confirm') {
              patchReply((t) => ({
                ...t,
                actions: [
                  ...t.actions,
                  { action: event.action, state: 'pending' },
                ],
              }))
            } else if (event.type === 'error') {
              patchReply((t) => ({
                ...t,
                error: true,
                content: t.content || event.message,
              }))
            }
          },
          controller.signal,
        )
      } catch (err) {
        if (!controller.signal.aborted) {
          patchReply((t) => ({
            ...t,
            error: true,
            content:
              t.content ||
              (err instanceof Error ? err.message : 'The assistant failed.'),
          }))
        }
      } finally {
        setBusy(false)
      }
    },
    [busy, turns],
  )

  const resolveAction = useCallback(
    async (turnIndex: number, actionIndex: number, confirm: boolean) => {
      const patch = (fn: (a: TurnAction) => TurnAction) =>
        setTurns((prev) => {
          const next = [...prev]
          const turn = next[turnIndex]
          if (!turn) return prev
          const actions = [...turn.actions]
          actions[actionIndex] = fn(actions[actionIndex])
          next[turnIndex] = { ...turn, actions }
          return next
        })

      if (!confirm) {
        patch((a) => ({ ...a, state: 'cancelled' }))
        return
      }
      patch((a) => ({ ...a, state: 'running' }))
      try {
        const target = turns[turnIndex]?.actions[actionIndex]
        if (!target) return
        const res = await assistantApi.execute(target.action)
        if (res.ok) {
          patch((a) => ({ ...a, state: 'done', note: 'Done' }))
        } else {
          const body = res.result as { message?: string | string[] } | null
          const message = Array.isArray(body?.message)
            ? body.message.join(', ')
            : (body?.message ?? `HTTP ${res.status}`)
          patch((a) => ({ ...a, state: 'failed', note: message }))
        }
      } catch (err) {
        patch((a) => ({
          ...a,
          state: 'failed',
          note: err instanceof Error ? err.message : 'Request failed',
        }))
      }
    },
    [turns],
  )

  if (configured === false) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-16 text-center">
        <Bot className="mx-auto h-10 w-10 text-muted-foreground" />
        <h1 className="mt-4 text-xl font-semibold text-foreground">
          AI Assistant
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The assistant is not configured yet. Set{' '}
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
            ANTHROPIC_API_KEY
          </code>{' '}
          in the backend environment and restart the API server to enable it.
          Everything it does runs under your own access — it can never see or
          change more than you can.
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-8rem)] max-w-3xl flex-col px-6 py-6">
      <header className="mb-4 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
          <Sparkles className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-foreground">
            AI Assistant
          </h1>
          <p className="text-xs text-muted-foreground">
            Answers about your portfolio, bounded by your own access.
          </p>
        </div>
      </header>

      <div className="flex-1 space-y-4 overflow-y-auto rounded-xl border bg-card p-4">
        {turns.length === 0 && (
          <div className="py-10 text-center">
            <p className="text-sm text-muted-foreground">
              Ask about projects, risks, KPIs, cycles or reports
              {me?.full_name ? `, ${me.full_name.split(' ')[0]}` : ''}.
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => void send(s)}
                  className="rounded-full border bg-background px-3 py-1.5 text-xs text-foreground transition-colors hover:border-primary/50 hover:text-primary"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {turns.map((turn, i) =>
          turn.role === 'user' ? (
            <div key={i} className="flex justify-end">
              <div className="max-w-[80%] rounded-2xl rounded-br-sm bg-primary px-4 py-2 text-sm text-primary-foreground">
                {turn.content}
              </div>
            </div>
          ) : (
            <div key={i} className="flex gap-3">
              <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Bot className="h-4 w-4 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                {turn.tools.length > 0 && (
                  <div className="mb-1.5 flex flex-wrap gap-1.5">
                    {turn.tools.map((name, j) => (
                      <span
                        key={j}
                        className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground"
                      >
                        <Search className="h-3 w-3" />
                        {TOOL_LABELS[name] ?? name}
                      </span>
                    ))}
                  </div>
                )}
                {turn.actions.map((a, j) => (
                  <div
                    key={j}
                    className="mb-2 rounded-lg border border-primary/30 bg-primary/5 px-3 py-2"
                  >
                    <div className="text-sm font-medium text-foreground">
                      {a.action.summary}
                    </div>
                    {a.state === 'pending' ? (
                      <div className="mt-2 flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => void resolveAction(i, j, true)}
                        >
                          <Check className="mr-1 h-3.5 w-3.5" /> Confirm
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => void resolveAction(i, j, false)}
                        >
                          <X className="mr-1 h-3.5 w-3.5" /> Cancel
                        </Button>
                      </div>
                    ) : (
                      <div
                        className={`mt-1 text-xs ${
                          a.state === 'done'
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : a.state === 'failed'
                              ? 'text-destructive'
                              : 'text-muted-foreground'
                        }`}
                      >
                        {a.state === 'running'
                          ? 'Executing…'
                          : a.state === 'done'
                            ? '✓ Executed'
                            : a.state === 'failed'
                              ? `Failed: ${a.note ?? ''}`
                              : 'Cancelled'}
                      </div>
                    )}
                  </div>
                ))}
                {turn.charts.map((chart, ci) => (
                  <AssistantChart key={ci} spec={chart} />
                ))}
                {turn.content ? (
                  turn.error ? (
                    <div className="whitespace-pre-wrap text-sm leading-relaxed text-destructive">
                      {turn.content}
                    </div>
                  ) : (
                    <AssistantMarkdown content={turn.content} />
                  )
                ) : (
                  busy &&
                  i === turns.length - 1 && (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  )
                )}
              </div>
            </div>
          ),
        )}
        <div ref={endRef} />
      </div>

      <form
        className="mt-3 flex items-end gap-2"
        onSubmit={(e) => {
          e.preventDefault()
          void send(input)
        }}
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              void send(input)
            }
          }}
          rows={2}
          placeholder="Ask about your portfolio…"
          className="flex-1 resize-none rounded-lg border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <Button type="submit" disabled={busy || !input.trim()} size="icon">
          {busy ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </form>
      <p className="mt-2 text-center text-[11px] text-muted-foreground">
        The assistant reads data with your permissions and can make mistakes —
        verify important figures.{' '}
        <Link to="/reporting" className="underline">
          Reports
        </Link>{' '}
        remain the source of truth.
      </p>
    </div>
  )
}
