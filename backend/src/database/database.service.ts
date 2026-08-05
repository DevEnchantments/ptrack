import {
  Injectable,
  OnModuleInit,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Agent, fetch as undiciFetch } from 'undici';

/**
 * Owns the single Supabase client, created with the SECRET key.
 *
 * The secret key bypasses Row-Level Security, so every query here runs fully
 * privileged. That's intentional: all authorization is enforced in the NestJS
 * layer (RLS is deferred to the security phase). The secret key must never
 * reach the browser.
 */
@Injectable()
export class DatabaseService implements OnModuleInit {
  private _client!: SupabaseClient;

  // Node's default fetch drops idle sockets after ~4s, so any request after a
  // short pause pays a fresh TLS handshake (~0.5-1s through the corporate
  // proxy). A long keep-alive reuses warm connections to Supabase instead.
  private readonly agent = new Agent({
    connections: 16,
    keepAliveTimeout: 60_000,
    keepAliveMaxTimeout: 10 * 60_000,
  });

  constructor(private readonly config: ConfigService) {}

  onModuleInit(): void {
    const url = this.config.get<string>('SUPABASE_URL');
    const secretKey = this.config.get<string>('SUPABASE_SECRET_KEY');

    if (!url || !secretKey) {
      throw new InternalServerErrorException(
        'SUPABASE_URL and SUPABASE_SECRET_KEY must be set in .env',
      );
    }

    const keepAliveFetch = ((input: unknown, init?: unknown) =>
      undiciFetch(input as Parameters<typeof undiciFetch>[0], {
        ...(init as Parameters<typeof undiciFetch>[1]),
        dispatcher: this.agent,
      })) as unknown as typeof fetch;

    this._client = createClient(url, secretKey, {
      auth: { autoRefreshToken: false, persistSession: false },
      global: { fetch: keepAliveFetch },
    }) as SupabaseClient;
  }

  /** The shared, privileged Supabase client. */
  get client(): SupabaseClient {
    return this._client;
  }
}
