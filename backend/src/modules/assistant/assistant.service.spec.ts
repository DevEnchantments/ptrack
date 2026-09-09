import { Logger } from '@nestjs/common';
import { AssistantService, AssistantEvent } from './assistant.service';
import { ChatMessageDto } from './dto/chat-request.dto';

/**
 * Minimal stand-in for one streamed iteration of the tool runner: an async
 * iterable of stream events plus the finalMessage() the service awaits to
 * let the runner continue.
 */
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

/**
 * Builds a service with the Anthropic client replaced. `toolRunner` records
 * the arguments it was called with, so tests can assert on the options the
 * service passed, then returns `runner`.
 */
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

const MESSAGES: ChatMessageDto[] = [{ role: 'user', content: 'hi' }];

describe('AssistantService.chat', () => {
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

  it('forwards the abort signal to the tool runner', async () => {
    const runner = fakeRunner([() => fakeStream([], { input: 1, output: 2 })]);
    const { service, calls } = makeService(runner);
    const aborter = new AbortController();

    await service.chat(MESSAGES, 'Bearer t', () => {}, aborter.signal);

    // Second argument is the request options; it must carry the signal, or
    // an aborted client leaves the model call running server-side.
    expect(calls[0][1]).toEqual({ signal: aborter.signal });
  });

  it('omits request options entirely when no signal is given', async () => {
    const runner = fakeRunner([() => fakeStream([], { input: 1, output: 2 })]);
    const { service, calls } = makeService(runner);

    await service.chat(MESSAGES, 'Bearer t', () => {});

    expect(calls[0][1]).toBeUndefined();
  });

  it('emits done and logs token usage on a normal turn', async () => {
    const runner = fakeRunner([
      () => fakeStream([], { input: 100, output: 20 }),
      () => fakeStream([], { input: 150, output: 30 }),
    ]);
    const { service } = makeService(runner);
    const events: AssistantEvent[] = [];

    await service.chat(MESSAGES, 'Bearer t', (e) => events.push(e));

    expect(events).toContainEqual({ type: 'done' });
    expect(logs).toContainEqual(
      'chat turn complete: 2 iteration(s), 250 in / 50 out',
    );
  });

  it('swallows the throw from an aborted run and does not emit done', async () => {
    const aborter = new AbortController();
    const runner = fakeRunner([
      () => fakeStream([], { input: 10, output: 5 }),
      () => {
        // The client goes away mid-run; the SDK then throws out of the loop.
        aborter.abort();
        throw new Error('The operation was aborted');
      },
    ]);
    const { service } = makeService(runner);
    const events: AssistantEvent[] = [];

    await expect(
      service.chat(MESSAGES, 'Bearer t', (e) => events.push(e), aborter.signal),
    ).resolves.toBeUndefined();

    expect(events).not.toContainEqual({ type: 'done' });
    expect(logs).toContainEqual(
      'chat aborted by client after 1 iteration(s), 10 in / 5 out',
    );
  });

  it('still propagates a genuine error when nothing was aborted', async () => {
    const runner = fakeRunner([
      () => fakeStream([], { input: 1, output: 1 }),
      () => {
        throw new Error('model exploded');
      },
    ]);
    const { service } = makeService(runner);

    await expect(service.chat(MESSAGES, 'Bearer t', () => {})).rejects.toThrow(
      'model exploded',
    );
  });
});
