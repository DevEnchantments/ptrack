import { UnauthorizedException, type ExecutionContext } from '@nestjs/common';
import type { Reflector } from '@nestjs/core';
import type { ConfigService } from '@nestjs/config';
import { SignJWT } from 'jose';
import { SupabaseAuthGuard } from './supabase-auth.guard';
import type { DatabaseService } from '../../database/database.service';

const SECRET = 'test-jwt-secret-with-enough-entropy-for-hs256';

function ctxWithToken(token?: string): ExecutionContext {
  const request: Record<string, unknown> = {
    headers: token ? { authorization: `Bearer ${token}` } : {},
  };
  return {
    switchToHttp: () => ({ getRequest: () => request }),
    getHandler: () => ({}),
    getClass: () => ({}),
    // Expose the request so tests can assert what the guard attached.
    __request: request,
  } as unknown as ExecutionContext;
}

function buildGuard(opts: {
  jwtSecret?: string;
  getUser?: jest.Mock;
  isPublic?: boolean;
}) {
  const reflector = {
    getAllAndOverride: jest.fn().mockReturnValue(opts.isPublic ?? false),
  } as unknown as Reflector;
  const config = {
    // No SUPABASE_URL: keeps the test offline (no JWKS) and skips the issuer
    // pin, so HS256 tokens signed below verify purely locally.
    get: (key: string) =>
      key === 'SUPABASE_JWT_SECRET' ? opts.jwtSecret : undefined,
  } as unknown as ConfigService;
  const db = {
    client: { auth: { getUser: opts.getUser ?? jest.fn() } },
  } as unknown as DatabaseService;
  return new SupabaseAuthGuard(reflector, config, db);
}

async function signHs256(claims: Record<string, unknown>, expiresIn: string) {
  return new SignJWT(claims)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(expiresIn)
    .sign(new TextEncoder().encode(SECRET));
}

describe('SupabaseAuthGuard', () => {
  it('lets @Public() routes through without a token', async () => {
    const guard = buildGuard({ isPublic: true });
    await expect(guard.canActivate(ctxWithToken())).resolves.toBe(true);
  });

  it('rejects a missing token', async () => {
    const guard = buildGuard({ jwtSecret: SECRET });
    await expect(guard.canActivate(ctxWithToken())).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('verifies a valid HS256 token locally and attaches the user', async () => {
    const guard = buildGuard({ jwtSecret: SECRET });
    const token = await signHs256({ sub: 'user-1', email: 'a@b.com' }, '5m');
    const ctx = ctxWithToken(token);

    await expect(guard.canActivate(ctx)).resolves.toBe(true);
    const request = (ctx as unknown as { __request: { user?: unknown } })
      .__request;
    expect(request.user).toEqual({ id: 'user-1', email: 'a@b.com' });
  });

  it('rejects an expired token locally', async () => {
    const guard = buildGuard({ jwtSecret: SECRET });
    const token = await signHs256({ sub: 'user-1' }, '-5m');
    await expect(guard.canActivate(ctxWithToken(token))).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('rejects a token signed with the wrong secret, without calling Supabase', async () => {
    const getUser = jest.fn();
    const guard = buildGuard({ jwtSecret: SECRET, getUser });
    const forged = await new SignJWT({ sub: 'user-1' })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('5m')
      .sign(new TextEncoder().encode('some-other-secret-entirely-wrong'));

    await expect(guard.canActivate(ctxWithToken(forged))).rejects.toThrow(
      UnauthorizedException,
    );
    expect(getUser).not.toHaveBeenCalled();
  });

  it('falls back to auth.getUser() when no local key material exists', async () => {
    const getUser = jest.fn().mockResolvedValue({
      data: { user: { id: 'remote-1', email: 'r@x.com' } },
      error: null,
    });
    // Neither SUPABASE_JWT_SECRET nor SUPABASE_URL configured.
    const guard = buildGuard({ getUser });
    const ctx = ctxWithToken('opaque-token');

    await expect(guard.canActivate(ctx)).resolves.toBe(true);
    expect(getUser).toHaveBeenCalledWith('opaque-token');
    const request = (ctx as unknown as { __request: { user?: unknown } })
      .__request;
    expect(request.user).toEqual({ id: 'remote-1', email: 'r@x.com' });
  });

  it('maps a remote rejection to 401', async () => {
    const getUser = jest
      .fn()
      .mockResolvedValue({ data: { user: null }, error: { message: 'bad' } });
    const guard = buildGuard({ getUser });
    await expect(guard.canActivate(ctxWithToken('nope'))).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
