import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { toHttpException } from '../../common/supabase-error';

// Whitelist of lookups the API will serve. Extend per feature so the endpoint
// can never be pointed at an arbitrary table.
const ALLOWED: Record<string, string> = {
  'project-roles': 'project_roles',
  'project-statuses': 'project_statuses',
  'project-sizes': 'project_sizes',
  'project-categories': 'project_categories',
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

  /** Creates a new project category (the demo allows this from the dropdown). */
  async createCategory(name: string) {
    const clean = (name ?? '').trim();
    if (!clean) throw new BadRequestException('Category name is required.');

    const { data, error } = await this.db.client
      .from('project_categories')
      .insert({ name: clean })
      .select('id, name')
      .single();

    if (error) throw toHttpException(error, 'lookups.createCategory');
    return data;
  }
}