import {
  Injectable,
  OnModuleInit,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

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

  constructor(private readonly config: ConfigService) {}

  onModuleInit(): void {
    const url = this.config.get<string>('SUPABASE_URL');
    const secretKey = this.config.get<string>('SUPABASE_SECRET_KEY');

    if (!url || !secretKey) {
      throw new InternalServerErrorException(
        'SUPABASE_URL and SUPABASE_SECRET_KEY must be set in .env',
      );
    }

    this._client = createClient(url, secretKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }

  /** The shared, privileged Supabase client. */
  get client(): SupabaseClient {
    return this._client;
  }
}
