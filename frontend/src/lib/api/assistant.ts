import { API_URL, apiGet, apiPost, authHeader } from './core'

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface AssistantAction {
  tool: string
  summary: string
  input: Record<string, string>
}

export type AssistantEvent =
  | { type: 'text'; delta: string }
  | { type: 'tool'; name: string }
  | { type: 'confirm'; action: AssistantAction }
  | { type: 'done' }
  | { type: 'error'; message: string }

export const assistantApi = {
  status: () => apiGet<{ configured: boolean }>('/assistant/status'),

  /** Executes a write action the user confirmed on its card. */
  execute: (action: AssistantAction) =>
    apiPost<{ ok: boolean; status: number; result: unknown }>(
      '/assistant/execute',
      { tool: action.tool, input: action.input },
    ),

  /**
   * One chat turn. The backend streams SSE frames; `onEvent` fires per frame.
   * EventSource cannot carry an Authorization header, so this parses the
   * stream off a plain fetch instead.
   */
  async chat(
    messages: ChatMessage[],
    onEvent: (event: AssistantEvent) => void,
    signal?: AbortSignal,
  ): Promise<void> {
    const headers = await authHeader()
    const res = await fetch(`${API_URL}/assistant/chat`, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages }),
      signal,
    })
    if (!res.ok || !res.body) {
      let message = `Request failed (${res.status})`
      try {
        const body = (await res.json()) as { message?: string | string[] }
        if (Array.isArray(body.message)) message = body.message.join(', ')
        else message = body.message ?? message
      } catch {
        /* no JSON body */
      }
      throw new Error(message)
    }

    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''
    for (;;) {
      const { done, value } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })
      // SSE frames are separated by a blank line.
      let sep = buffer.indexOf('\n\n')
      while (sep !== -1) {
        const frame = buffer.slice(0, sep)
        buffer = buffer.slice(sep + 2)
        const data = frame
          .split('\n')
          .filter((l) => l.startsWith('data: '))
          .map((l) => l.slice(6))
          .join('')
        if (data) {
          try {
            onEvent(JSON.parse(data) as AssistantEvent)
          } catch {
            /* skip malformed frame */
          }
        }
        sep = buffer.indexOf('\n\n')
      }
    }
  },
}
