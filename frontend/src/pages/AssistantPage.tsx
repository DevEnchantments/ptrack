import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  assistantApi,
  type AssistantEvent,
  type ChatMessage,
} from '@/lib/api'
import { useMe } from '@/lib/use-me'
import { Button } from '@/components/ui/button'
import { Bot, Loader2, Search, Send, Sparkles } from 'lucide-react'

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
}

const SUGGESTIONS = [
  'Which projects are off target, and why?',
  'Summarize the open risks across my projects',
  "What's the status of this month's submission cycle?",
  'What is on my plate this week?',
]

interface Turn {
  role: 'user' | 'assistant'
  content: string
  /** Tool activity that produced this assistant turn, in call order. */
  tools: string[]
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

      const history: ChatMessage[] = [
        ...turns
          .filter((t) => !t.error)
          .map((t) => ({ role: t.role, content: t.content })),
        { role: 'user', content: question },
      ]
      setTurns((prev) => [
        ...prev,
        { role: 'user', content: question, tools: [] },
        { role: 'assistant', content: '', tools: [] },
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
              patchReply((t) => ({ ...t, tools: [...t.tools, event.name] }))
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
                {turn.content ? (
                  <div
                    className={`whitespace-pre-wrap text-sm leading-relaxed ${
                      turn.error ? 'text-destructive' : 'text-foreground'
                    }`}
                  >
                    {turn.content}
                  </div>
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
