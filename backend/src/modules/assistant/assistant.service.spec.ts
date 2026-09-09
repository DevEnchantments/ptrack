import { Logger } from '@nestjs/common';
import { AssistantService, AssistantEvent } from './assistant.service';
import { ChatMessageDto } from './dto/chat-request.dto';

/**
 * Characterization suite for the assistant service.
 *
 * The service is the only place where the model is allowed to reach the rest
 * of the app, so the properties pinned here are the security-relevant ones:
 * write tools never execute during a chat turn, every loopback call carries
 * the caller's own JWT, and execute() only builds calls the catalog can
 * build. Behaviour is recorded as-is; no app code changed to make it pass.
 */

/** The parts of a runnable tool the tests drive. */
interface RunnableTool {
  name: string;
  run: (input: Record<string, string>) => Promise<string> | string;
}

function fakeStream(
  events: unknown[],
  usage: { input: number; output: number },
) {
  return {
    [Symbol.asyncIterator]: async function* () {
      for (const event of events) yield await Promise.resolve(event);
    },
    finalMessage: () =>
      Promise.resolve({
        usage: { input_tokens: usage.input, output_tokens: usage.output },
      }),
  };
}

/**
 * Async-iterable stand-in for the runner. Each step either returns one
 * iteration to yield or throws, which is how an aborted or failed run
 * surfaces out of the SDK's loop.
 */
function fakeRunner(steps: Array<() => unknown>) {
  return {
    [Symbol.asyncIterator]: async function* () {
      for (const step of steps) yield await Promise.resolve(step());
    },
  };
}

function makeService(runner: unknown) {
  process.env.ANTHROPIC_API_KEY = 'test-key';
  const service = new AssistantService();
  const calls: unknown[][] = [];
  const client = {
    beta: {
      messages: {
        toolRunner: (...args: unknown[]) => {
          calls.push(args);
          return runner;
        },
      },
    },
  };
  (service as unknown as { client: unknown }).client = client;
  return { service, calls };
}

/** Stubs global fetch, recording every loopback call the service makes. */
function mockFetch(responses: Array<{ status?: number; body: string }>) {
  const calls: Array<{ url: string; init?: RequestInit }> = [];
  let next = 0;
  jest
    .spyOn(global, 'fetch')
    .mockImplementation((input: unknown, init?: RequestInit) => {
      calls.push({ url: String(input), init });
      const res = responses[Math.min(next, responses.length - 1)];
      next += 1;
      const status = res.status ?? 200;
      return Promise.resolve({
        ok: status >= 200 && status < 300,
        status,
        text: () => Promise.resolve(res.body),
      } as unknown as Response);
    });
  return calls;
}

const MESSAGES: ChatMessageDto[] = [{ role: 'user', content: 'hi' }];
const AUTH = 'Bearer user-jwt';
const BASE = `http://127.0.0.1:${process.env.PORT ?? 3000}`;

/**
 * Runs one empty chat turn purely to capture the tool array the service
 * handed the runner, so the tests can invoke individual tools directly.
 */
async function captureTools(emit: (e: AssistantEvent) => void = () => {}) {
  const { service, calls } = makeService(fakeRunner([]));
  await service.chat(MESSAGES, AUTH, emit);
  const params = calls[0][0] as { tools: RunnableTool[] };
  const tool = (name: string) => {
    const found = params.tools.find((t) => t.name === name);
    if (!found) throw new Error(`tool not in catalog: ${name}`);
    return found;
  };
  return { service, tools: params.tools, tool };
}

describe('AssistantService', () => {
  let logs: string[];

  beforeEach(() => {
    logs = [];
    jest
      .spyOn(Logger.prototype, 'log')
      .mockImplementation((message: unknown) => {
        logs.push(String(message));
      });
  });

  afterEach(() => jest.restoreAllMocks());

  describe('configuration', () => {
    it('reports unconfigured and refuses to chat without an API key', async () => {
      const saved = process.env.ANTHROPIC_API_KEY;
      delete process.env.ANTHROPIC_API_KEY;
      const service = new AssistantService();

      expect(service.configured).toBe(false);
      await expect(service.chat(MESSAGES, AUTH, () => {})).rejects.toThrow(
        /not configured/,
      );

      if (saved !== undefined) process.env.ANTHROPIC_API_KEY = saved;
    });
  });

  describe('chat lifecycle', () => {
    it('forwards the abort signal to the tool runner', async () => {
      const { service, calls } = makeService(
        fakeRunner([() => fakeStream([], { input: 1, output: 2 })]),
      );
      const aborter = new AbortController();

      await service.chat(MESSAGES, AUTH, () => {}, aborter.signal);

      // Second argument is the request options; it must carry the signal, or
      // an aborted client leaves the model call running server-side.
      expect(calls[0][1]).toEqual({ signal: aborter.signal });
    });

    it('omits request options entirely when no signal is given', async () => {
      const { service, calls } = makeService(
        fakeRunner([() => fakeStream([], { input: 1, output: 2 })]),
      );

      await service.chat(MESSAGES, AUTH, () => {});

      expect(calls[0][1]).toBeUndefined();
    });

    it('emits done and logs token usage on a normal turn', async () => {
      const { service } = makeService(
        fakeRunner([
          () => fakeStream([], { input: 100, output: 20 }),
          () => fakeStream([], { input: 150, output: 30 }),
        ]),
      );
      const events: AssistantEvent[] = [];

      await service.chat(MESSAGES, AUTH, (e) => events.push(e));

      expect(events).toContainEqual({ type: 'done' });
      expect(logs).toContainEqual(
        'chat turn complete: 2 iteration(s), 250 in / 50 out',
      );
    });

    it('swallows the throw from an aborted run and does not emit done', async () => {
      const aborter = new AbortController();
      const { service } = makeService(
        fakeRunner([
          () => fakeStream([], { input: 10, output: 5 }),
          () => {
            // The client goes away mid-run; the SDK throws out of the loop.
            aborter.abort();
            throw new Error('The operation was aborted');
          },
        ]),
      );
      const events: AssistantEvent[] = [];

      await expect(
        service.chat(MESSAGES, AUTH, (e) => events.push(e), aborter.signal),
      ).resolves.toBeUndefined();

      expect(events).not.toContainEqual({ type: 'done' });
      expect(logs).toContainEqual(
        'chat aborted by client after 1 iteration(s), 10 in / 5 out',
      );
    });

    it('still propagates a genuine error when nothing was aborted', async () => {
      const { service } = makeService(
        fakeRunner([
          () => fakeStream([], { input: 1, output: 1 }),
          () => {
            throw new Error('model exploded');
          },
        ]),
      );

      await expect(service.chat(MESSAGES, AUTH, () => {})).rejects.toThrow(
        'model exploded',
      );
    });
  });

  describe('read tools', () => {
    it("calls the loopback endpoint with the caller's own JWT", async () => {
      const fetches = mockFetch([{ body: '{"id":"u-1"}' }]);
      const { tool } = await captureTools();

      const result = await tool('get_me').run({});

      expect(fetches).toHaveLength(1);
      expect(fetches[0].url).toBe(`${BASE}/users/me`);
      expect(fetches[0].init?.headers).toEqual({ Authorization: AUTH });
      expect(result).toBe('{"id":"u-1"}');
    });

    it('relays an HTTP error as text rather than throwing', async () => {
      mockFetch([{ status: 403, body: '{"message":"Forbidden project"}' }]);
      const { tool } = await captureTools();

      await expect(tool('get_me').run({})).resolves.toBe(
        'Request failed (HTTP 403): Forbidden project',
      );
    });

    it('falls back to the raw body when the error is not JSON', async () => {
      mockFetch([{ status: 500, body: 'upstream exploded' }]);
      const { tool } = await captureTools();

      await expect(tool('get_me').run({})).resolves.toBe(
        'Request failed (HTTP 500): upstream exploded',
      );
    });

    it('truncates an oversized result instead of flooding the context', async () => {
      mockFetch([{ body: 'x'.repeat(60_000) }]);
      const { tool } = await captureTools();

      const result = await tool('get_me').run({});

      expect(typeof result).toBe('string');
      expect(result).toContain('[truncated: result too large');
      // 48k payload plus the trailing marker, nowhere near the 60k original.
      expect(result.length).toBeLessThan(50_000);
    });
  });

  describe('write tools', () => {
    it('never executes during a chat turn: it only raises a confirm card', async () => {
      const fetches = mockFetch([{ body: '{}' }]);
      const events: AssistantEvent[] = [];
      const { tool } = await captureTools((e) => events.push(e));

      const result = await tool('create_action_item').run({
        project_id: 'p-1',
        title: 'Ship it',
        due_date: '2026-10-01',
      });

      // The critical property: no side effect reached the API.
      expect(fetches).toHaveLength(0);
      expect(result).toContain('PENDING USER CONFIRMATION');
      expect(events).toContainEqual({
        type: 'confirm',
        action: {
          tool: 'create_action_item',
          summary: 'Create action item "Ship it" due 2026-10-01',
          input: {
            project_id: 'p-1',
            title: 'Ship it',
            due_date: '2026-10-01',
          },
        },
      });
    });
  });

  describe('render_chart', () => {
    it('emits a chart frame for a valid spec', async () => {
      const events: AssistantEvent[] = [];
      const { tool } = await captureTools((e) => events.push(e));

      const result = await tool('render_chart').run({
        type: 'bar',
        title: 'Budget',
        categories: ['A'],
        series: [{ name: 'Approved', values: [10] }],
      } as unknown as Record<string, string>);

      expect(result).toContain('Chart displayed to the user');
      expect(events.some((e) => e.type === 'chart')).toBe(true);
    });

    it('reports an invalid spec back to the model without drawing', async () => {
      const events: AssistantEvent[] = [];
      const { tool } = await captureTools((e) => events.push(e));

      const result = await tool('render_chart').run({
        type: 'line',
        title: 't',
        categories: ['Jan', 'Feb', 'Mar'],
        series: [{ name: 's', values: [1, 2] }],
      } as unknown as Record<string, string>);

      expect(result).toContain('INVALID CHART, not displayed');
      expect(events.some((e) => e.type === 'chart')).toBe(false);
    });
  });

  describe('execute', () => {
    it('rejects a tool that is not in the write catalog', async () => {
      const { service } = makeService(fakeRunner([]));

      await expect(service.execute('drop_database', {}, AUTH)).rejects.toThrow(
        /Unknown assistant action/,
      );
    });

    it('rejects a read tool, so only write actions are executable', async () => {
      const { service } = makeService(fakeRunner([]));

      await expect(service.execute('get_me', {}, AUTH)).rejects.toThrow(
        /Unknown assistant action/,
      );
    });

    it('rejects input missing a required field', async () => {
      const { service } = makeService(fakeRunner([]));

      await expect(
        service.execute(
          'create_action_item',
          { project_id: 'p-1', title: 'no due date' },
          AUTH,
        ),
      ).rejects.toThrow(/Missing action field: due_date/);
    });

    it('runs the confirmed action against the loopback API as the user', async () => {
      const fetches = mockFetch([{ status: 201, body: '{"id":"ai-9"}' }]);
      const { service } = makeService(fakeRunner([]));

      const out = await service.execute(
        'create_action_item',
        { project_id: 'p-1', title: 'Ship it', due_date: '2026-10-01' },
        AUTH,
      );

      expect(fetches[0].url).toBe(`${BASE}/projects/p-1/action-items`);
      expect(fetches[0].init?.method).toBe('POST');
      expect(fetches[0].init?.headers).toEqual({
        Authorization: AUTH,
        'Content-Type': 'application/json',
      });
      expect(JSON.parse(fetches[0].init?.body as string)).toEqual({
        title: 'Ship it',
        due_date: '2026-10-01',
        status: 'open',
      });
      expect(out).toEqual({ ok: true, status: 201, result: { id: 'ai-9' } });
    });

    it('reports a rejected action without throwing, so the UI can show why', async () => {
      mockFetch([{ status: 403, body: '{"message":"Forbidden"}' }]);
      const { service } = makeService(fakeRunner([]));

      const out = await service.execute(
        'create_action_item',
        { project_id: 'p-1', title: 'Ship it', due_date: '2026-10-01' },
        AUTH,
      );

      expect(out.ok).toBe(false);
      expect(out.status).toBe(403);
    });

    it('passes a non-JSON response body through as raw text', async () => {
      mockFetch([{ status: 200, body: 'plain ok' }]);
      const { service } = makeService(fakeRunner([]));

      const out = await service.execute(
        'create_action_item',
        { project_id: 'p-1', title: 'Ship it', due_date: '2026-10-01' },
        AUTH,
      );

      expect(out.result).toBe('plain ok');
    });
  });
});
