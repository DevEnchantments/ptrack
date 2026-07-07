import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { toHttpException } from '../../common/supabase-error';

// Whitelist of lookups the API will serve. We extend this per feature so the
// endpoint can never be pointed at an arbitrary table.
const ALLOWED: Record<string, string> = {
  'project-roles': 'project_roles',
};

@Injectable()
export class LookupsService {
  constructor(private readonly db: DatabaseService) {}

  async list(name: string) {
    const table = ALLOWED[name];
    if (!table) throw new NotFoundException(`Unknown lookup: ${name}`);

    const { data, error } = await this.db.client
      .from(table)
      .select('id, name')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) throw toHttpException(error, `lookups.${name}`);
    return data ?? [];
  }
}