import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { toHttpException } from '../../common/supabase-error';

@Injectable()
export class UsersService {
  constructor(private readonly db: DatabaseService) {}

  /** Existing application users (profiles), optionally filtered by search text. */
  async search(query?: string) {
    let q = this.db.client
      .from('profiles')
      .select('id, full_name, email')
      .order('full_name', { ascending: true })
      .limit(20);

    const term = query?.trim();
    if (term) {
      q = q.or(`full_name.ilike.%${term}%,email.ilike.%${term}%`);
    }

    const { data, error } = await q;
    if (error) throw toHttpException(error, 'users.search');
    return data ?? [];
  }
}