import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import {
  createRemoteJWKSet,
  jwtVerify,
  errors as joseErrors,
  type JWTPayload,
} from 'jose';
import { DatabaseService } from '../../database/database.service';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

interface AuthedRequest {
  headers: Record<string, string | undefined>;
  user?: { id: string; email: string | null };
}

/**
 * Verifies the Supabase user JWT on incoming requests and attaches
 * { id, email } to the request as `request.user`. Routes marked @Public()
 * skip this check.
 *
 * Verification is LOCAL — the signature is checked in-process instead of
 * calling Supabase Auth over the network per request (which added a full
 * HTTPS round-trip to every guarded call; a project page load makes 9).
 *
 * Key material, in order:
 *   1. SUPABASE_JWT_SECRET set  -> HS256 shared secret (legacy projects).
 *   2. Otherwise                -> the project's public JWKS endpoint
 *      (current Supabase projects sign with asymmetric keys). jose caches
 *      the key set in memory, so this is only a network call on cold start
 *      or key rotation.
 *
 * If a token cannot be matched to any local key (e.g. a legacy HS256 token
 * but no SUPABASE_JWT_SECRET configured), the guard falls back to the old
 * auth.getUser() network check and logs a one-time warning — slower, never
 * a lockout.
 */
@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  private readonly logger = new Logger(SupabaseAuthGuard.name);
  private jwks?: ReturnType<typeof createRemoteJWKSet>;
  private hsSecret?: Uint8Array;
  private issuer?: string;
  private warnedFallback = false;

  constructor(
    private readonly reflector: Reflector,
    private readonly config: ConfigService,
    private readonly db: DatabaseService,
  ) {
    const url = this.config.get<string>('SUPABASE_URL');
    if (url) {
      const base = url.replace(/\/+$/, '');
      this.issuer = `${base}/auth/v1`;
      this.jwks = createRemoteJWKSet(
        new URL(`${base}/auth/v1/.well-known/jwks.json`),
      );
    }
    const secret = this.config.get<string>('SUPABASE_JWT_SECRET');
    if (secret) this.hsSecret = new TextEncoder().encode(secret);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest<AuthedRequest>();
    const token = this.extractToken(request);
    if (!token) {
      throw new UnauthorizedException('Missing bearer token');
    }

    request.user = await this.verify(token);
    return true;
  }

  private async verify(
    token: string,
  ): Promise<{ id: string; email: string | null }> {
    let payload: JWTPayload;
    try {
      if (this.hsSecret) {
        ({ payload } = await jwtVerify(token, this.hsSecret, {
          issuer: this.issuer,
        }));
      } else if (this.jwks) {
        ({ payload } = await jwtVerify(token, this.jwks, {
          issuer: this.issuer,
        }));
      } else {
        return this.verifyRemotely(token);
      }
    } catch (e) {
      // No local key can even be tried against this token (typically a legacy
      // HS256 token with no SUPABASE_JWT_SECRET set — JWKS only carries
      // asymmetric keys, so jose reports the alg as unsupported/unmatched).
      // Degrade to the network check rather than locking every request out.
      if (
        e instanceof joseErrors.JWKSNoMatchingKey ||
        e instanceof joseErrors.JOSEAlgNotAllowed ||
        e instanceof joseErrors.JOSENotSupported ||
        e instanceof joseErrors.JWKSInvalid
      ) {
        if (!this.warnedFallback) {
          this.warnedFallback = true;
          this.logger.warn(
            'Local JWT verification found no matching key — falling back to ' +
              'auth.getUser() per request. If this project uses the legacy ' +
              'HS256 secret, set SUPABASE_JWT_SECRET in .env to restore ' +
              'local verification.',
          );
        }
        return this.verifyRemotely(token);
      }
      throw new UnauthorizedException('Invalid or expired token');
    }

    if (!payload.sub) {
      throw new UnauthorizedException('Invalid or expired token');
    }
    return {
      id: payload.sub,
      email: typeof payload.email === 'string' ? payload.email : null,
    };
  }

  /** The pre-optimization path: one HTTPS call to Supabase Auth per request. */
  private async verifyRemotely(
    token: string,
  ): Promise<{ id: string; email: string | null }> {
    const { data, error } = await this.db.client.auth.getUser(token);
    if (error || !data?.user) {
      throw new UnauthorizedException('Invalid or expired token');
    }
    return { id: data.user.id, email: data.user.email ?? null };
  }

  private extractToken(request: AuthedRequest): string | null {
    const header = request.headers?.authorization;
    if (!header) return null;
    const [scheme, token] = header.split(' ');
    return scheme?.toLowerCase() === 'bearer' && token ? token : null;
  }
}
