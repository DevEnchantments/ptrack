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
};

const ACCESS_LEVELS = ['read_only', 'read_write', 'read_write_admin'];

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
    return data;
  }
}