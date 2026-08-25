import {
  BadRequestException,
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import Anthropic from '@anthropic-ai/sdk';
import { betaTool } from '@anthropic-ai/sdk/helpers/beta/json-schema';
import { READ_TOOLS, WRITE_TOOLS } from './assistant.tools';
import { ChatMessageDto } from './dto/chat-request.dto';

/** One SSE frame sent to the chat UI. */
export type AssistantEvent =
  | { type: 'text'; delta: string }
  | { type: 'tool'; name: string }
  | {
      type: 'confirm';
      action: { tool: string; summary: string; input: Record<string, string> };
    }
  | { type: 'done' }
  | { type: 'error'; message: string };

/** Tool results larger than this are truncated before reaching the model. */
const MAX_TOOL_RESULT_CHARS = 48_000;
const MAX_LOOP_ITERATIONS = 12;

const SYSTEM_PROMPT = `You are the P-Track assistant, embedded in an enterprise Project Portfolio Management application. You help the signed-in user understand and navigate their portfolio: projects, milestones, action items, issues, risks, KPIs, monthly submission cycles and portfolio reports.

Ground rules:
- Every tool call runs with the user's own permissions. A 404 can mean the record does not exist OR the user cannot see it; a 403 means they lack the right; relay either as a plain, friendly explanation — never speculate about hidden data.
- Never invent record ids. Resolve names with search_records or list_projects first.
- You can prepare changes (action items, issues, risks, updates, cycle submission) with the write tools, but a write tool NEVER executes anything: it shows the user a confirmation card, and only their explicit Confirm click runs the action. After calling a write tool, tell the user briefly what you prepared and that it awaits their confirmation. Never state or imply that a change was already made. One write tool call per requested change.
- Lead with the answer and keep it concise. Use the record names the user used. Format money with thousands separators and the currency (AED unless stated otherwise).
- Formatting: the chat renders GitHub-flavoured Markdown. When listing three or more records with several attributes, use a table (reference or name first). Use bold only for the key figure or status in a sentence, headings no deeper than ### and only when an answer has distinct parts, and prose for everything else.
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

    const readTools = READ_TOOLS.map((t) =>
      betaTool({
        name: t.name,
        description: t.description,
        inputSchema: t.input_schema as never,
        run: (input: Record<string, string>) =>
          this.callApi(t.path(input), authorization),
      }),
    );
    // Write tools never execute here: they surface a confirmation card and
    // tell the model so. Execution happens only via execute() below, after
    // the user's explicit Confirm click.
    const writeTools = WRITE_TOOLS.map((t) =>
      betaTool({
        name: t.name,
        description: t.description,
        inputSchema: t.input_schema as never,
        run: (input: Record<string, string>) => {
          emit({
            type: 'confirm',
            action: { tool: t.name, summary: t.summary(input), input },
          });
          return Promise.resolve(
            'PENDING USER CONFIRMATION: the action was presented to the ' +
              'user as a confirmation card. It has NOT been executed and ' +
              'may be cancelled. Tell the user to review and confirm it.',
          );
        },
      }),
    );
    const tools = [...readTools, ...writeTools];

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

  /**
   * Executes one previously confirmed write action. The (tool, input) pair
   * is re-resolved against the catalog, so only calls the catalog can build
   * are possible; authorization is still entirely the loopback guard chain,
   * running under the caller's own JWT.
   */
  async execute(
    toolName: string,
    input: Record<string, string>,
    authorization: string,
  ): Promise<{ ok: boolean; status: number; result: unknown }> {
    const tool = WRITE_TOOLS.find((t) => t.name === toolName);
    if (!tool) {
      throw new BadRequestException(`Unknown assistant action: ${toolName}`);
    }
    const schema = tool.input_schema as { required?: string[] };
    for (const key of schema.required ?? []) {
      if (typeof input[key] !== 'string' || input[key].length === 0) {
        throw new BadRequestException(`Missing action field: ${key}`);
      }
    }
    const action = tool.action(input);
    const res = await fetch(`${this.loopbackBase}${action.path}`, {
      method: action.method,
      headers: {
        Authorization: authorization,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.body),
    });
    const text = await res.text();
    let result: unknown = text;
    try {
      result = JSON.parse(text);
    } catch {
      /* non-JSON body */
    }
    return { ok: res.ok, status: res.status, result };
  }
}
