import { UserThrottlerGuard } from './user-throttler.guard';

/** Reaches the protected getTracker without standing up the Nest context. */
function track(guard: UserThrottlerGuard, req: Record<string, unknown>) {
  return (
    guard as unknown as {
      getTracker(r: Record<string, unknown>): Promise<string>;
    }
  ).getTracker(req);
}

describe('UserThrottlerGuard', () => {
  const guard = Object.create(
    UserThrottlerGuard.prototype,
  ) as UserThrottlerGuard;

  it('buckets by user id so one office NAT is not a shared quota', async () => {
    await expect(
      track(guard, { user: { id: 'u-1' }, ip: '10.0.0.5' }),
    ).resolves.toBe('u-1');
    await expect(
      track(guard, { user: { id: 'u-2' }, ip: '10.0.0.5' }),
    ).resolves.toBe('u-2');
  });

  it('falls back to the ip when no user is attached', async () => {
    await expect(track(guard, { ip: '10.0.0.5' })).resolves.toBe('10.0.0.5');
  });

  it('falls back to a constant when neither is present', async () => {
    await expect(track(guard, {})).resolves.toBe('anonymous');
  });
});
