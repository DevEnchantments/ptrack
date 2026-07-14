import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { toHttpException } from '../../common/supabase-error';

const ALLOWED: Record<string, string> = {
  'project-roles': 'project_roles',
  'project-statuses': 'project_statuses',
  'project-sizes': 'project_sizes',
  'project-categories': 'project_categories',
  'involvement-levels': 'involvement_levels',
  'action-item-types': 'action_item_types',
  'resource-types': 'resource_types',
  'issue-categories': 'issue_categories',
  'issue-levels': 'issue_levels',
  'update-types': 'update_types',
  'update-classes': 'update_classes',
};

const ACCESS_LEVELS = ['read_only', 'read_write', 'read_write_admin'];

// Lookup tables are near-static (they change through admin action, not user
// traffic), yet every dialog open refetches them. A short TTL keeps the data
// fresh-enough while making repeat opens free. Writes below invalidate early.
const CACHE_TTL_MS = 60_000;

interface CacheSlot {
  data: Array<{ id: string; name: string }>;
  expires: number;
}

@Injectable()
export class LookupsService {
  private readonly cache = new Map<string, CacheSlot>();

  constructor(private readonly db: DatabaseService) {}

  async list(name: string) {
    const table = ALLOWED[name];
    if (!table) throw new NotFoundException(`Unknown lookup: ${name}`);

    const hit = this.cache.get(name);
    if (hit && hit.expires > Date.now()) return hit.data;

    const { data, error } = await this.db.client
      .from(table)
      .select('id, name')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });
    if (error) throw toHttpException(error, `lookups.${name}`);

    const rows = data ?? [];
    this.cache.set(name, { data: rows, expires: Date.now() + CACHE_TTL_MS });
    return rows;
  }

  async createCategory(name: string) {
    const clean = (name ?? '').trim();
    if (!clean) throw new BadRequestException('Category name is required.');
    const { data, error } = await this.db.client
      .from('project_categories')
      .insert({ name: clean })
      .select('id, name')
      .single();
    if (error) throw toHttpException(error, 'lookups.createCategory');
    this.cache.delete('project-categories');
    return data;
  }

  async createRole(name: string, defaultAccessLevel: string) {
    const clean = (name ?? '').trim();
    if (!clean) throw new BadRequestException('Role name is required.');
    const level = ACCESS_LEVELS.includes(defaultAccessLevel)
      ? defaultAccessLevel
      : 'read_only';
    const { data, error } = await this.db.client
      .from('project_roles')
      .insert({ name: clean, default_access_level: level })
      .select('id, name')
      .single();
    if (error) throw toHttpException(error, 'lookups.createRole');
    this.cache.delete('project-roles');
    return data;
  }
}
