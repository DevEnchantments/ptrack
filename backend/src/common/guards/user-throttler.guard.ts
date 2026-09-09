import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

/**
 * Rate-limits per signed-in user instead of per IP.
 *
 * The stock ThrottlerGuard buckets by IP, which is wrong here: everyone
 * behind one office NAT shares a single bucket, so one heavy assistant user
 * would lock out the whole floor. request.user is attached by
 * SupabaseAuthGuard, which always runs first (see the guard-order comment in
 * app.module.ts), so the id is available by the time this runs.
 *
 * The IP fallback only matters for a route that is both @Public() and
 * throttled; there is none today, but falling back is safer than throwing.
 */
@Injectable()
export class UserThrottlerGuard extends ThrottlerGuard {
  protected getTracker(req: Record<string, unknown>): Promise<string> {
    const user = req.user as { id?: string } | undefined;
    const ip = typeof req.ip === 'string' ? req.ip : undefined;
    return Promise.resolve(user?.id ?? ip ?? 'anonymous');
  }
}
