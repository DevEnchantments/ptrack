import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import Anthropic from '@anthropic-ai/sdk';
import { betaTool } from '@anthropic-ai/sdk/helpers/beta/json-schema';
import { READ_TOOLS } from './assistant.tools';
import { ChatMessageDto } from './dto/chat-request.dto';

/** One SSE frame sent to the chat UI. */
export type AssistantEvent =
  | { type: 'text'; delta: string }
  | { type: 'tool'; name: string }
  | { type: 'done' }
  | { type: 'error'; message: string };

/** Tool results larger than this are truncated before reaching the model. */
const MAX_TOOL_RESULT_CHARS = 48_000;
const MAX_LOOP_ITERATIONS = 12;

const SYSTEM_PROMPT = `You are the P-Track assistant, embedded in an enterprise Project Portfolio Management application. You help the signed-in user understand and navigate their portfolio: projects, milestones, action items, issues, risks, KPIs, monthly submission cycles and portfolio reports.

Ground rules:
- Every tool call runs with the user's own permissions. A 404 can mean the record does not exist OR the user cannot see it; a 403 means they lack the right; relay either as a plain, friendly explanation — never speculate about hidden data.
- Never invent record ids. Resolve names with search_records or list_projects first.
- You are currently read-only: you can look anything up but cannot create or change records yet. If asked to modify something, explain that and point at where in the UI they can do it.
- Answer in plain prose, lead with the answer, keep it concise. Use the record names the user used. Format money with thousands separators and the currency (AED unless stated otherwise).
- Progress figures: "planned" is schedule-elapsed progress, "calculated" is milestone-weighted actual progress; the delta (calculated minus planned) drives the health bucket.
- If a question needs data you have no tool for, say so rather than guessing.`;

@Injectable()
export class AssistantService {
  private readonly logger = new Logger(AssistantService.name);
  private readonly client: Anthropic | null;
  private readonly loopbackBase = `http://127.0.0.1:${process.env.PORT ?? 3000}`;

  constructor() {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    this.client = apiKey ? new Anthropic({ apiKey }) : null;
  }

  get configured(): boolean {
    return this.client !== null;
  }

  /**
   * Executes one endpoint on the user's behalf. The Authorization header is
   * the caller's own JWT, so the global guard chain authorizes the loopback
   * request exactly as it would a browser call — the assistant has no
   * privileges of its own.
   */
  private async callApi(path: string, authorization: string): Promise<string> {
    const res = await fetch(`${this.loopbackBase}${path}`, {
      headers: { Authorization: authorization },
    });
    const body = await res.text();
    if (!res.ok) {
      let message = body;
      try {
        message = (JSON.parse(body) as { message?: string }).message ?? body;
      } catch {
        /* non-JSON error body */
      }
      return `Request failed (HTTP ${res.status}): ${message}`;
    }
    if (body.length > MAX_TOOL_RESULT_CHARS) {
      return `${body.slice(0, MAX_TOOL_RESULT_CHARS)}\n...[truncated: result too large; ask a narrower question]`;
    }
    return body;
  }

  /**
   * Runs one chat turn as an agentic loop, emitting SSE frames via `emit`.
   * The transcript is client-held (text only) and re-sent each turn.
   */
  async chat(
    messages: ChatMessageDto[],
    authorization: string,
    emit: (event: AssistantEvent) => void,
  ): Promise<void> {
    if (!this.client) {
      throw new ServiceUnavailableException(
        'The assistant is not configured (ANTHROPIC_API_KEY is missing).',
      );
    }

    const tools = READ_TOOLS.map((t) =>
      betaTool({
        name: t.name,
        description: t.description,
        inputSchema: t.input_schema as never,
        run: (input: Record<string, string>) =>
          this.callApi(t.path(input), authorization),
      }),
    );

    const runner = this.client.beta.messages.toolRunner({
      model: 'claude-opus-5',
      max_tokens: 16000,
      system: SYSTEM_PROMPT,
      tools,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
      stream: true,
      max_iterations: MAX_LOOP_ITERATIONS,
    });

    for await (const stream of runner) {
      for await (const event of stream) {
        if (
          event.type === 'content_block_delta' &&
          event.delta.type === 'text_delta'
        ) {
          emit({ type: 'text', delta: event.delta.text });
        } else if (
          event.type === 'content_block_start' &&
          event.content_block.type === 'tool_use'
        ) {
          emit({ type: 'tool', name: event.content_block.name });
        }
      }
      // Resolve the iteration so the runner can execute tools and continue.
      await stream.finalMessage();
    }
    emit({ type: 'done' });
  }
}
