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
  tiers: 'tiers',
  'strategic-objectives': 'strategic_objectives',
  'risk-categories': 'risk_categories',
  'risk-sources': 'risk_sources',
  'risk-probability-levels': 'risk_probability_levels',
  'risk-impact-levels': 'risk_impact_levels',
  'risk-responses': 'risk_responses',
  sectors: 'sectors',
  'strategic-programs': 'strategic_programs',
};

// Most lookups serve id+name; tables here carry extra columns the UI needs
// (e.g. the objective a program cascades under).
const SELECTS: Record<string, string> = {
  strategic_programs: 'id, name, objective_id',
};

const ACCESS_LEVELS = ['read_only', 'read_write', 'read_write_admin'];

// Lookup tables are near-static (they change through admin action, not user
// traffic), yet every dialog open refetches them. A short TTL keeps the data
// fresh-enough while making repeat opens free. Writes below invalidate early.
const CACHE_TTL_MS = 60_000;

export interface LookupRow {
  id: string;
  name: string;
  /** Present only for cascading lookups (e.g. strategic_programs). */
  objective_id?: string | null;
}

interface CacheSlot {
  data: LookupRow[];
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
      .select(SELECTS[table] ?? 'id, name')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });
    if (error) throw toHttpException(error, `lookups.${name}`);

    // The dynamic select string defeats supabase-js's literal-type inference.
    const rows = (data ?? []) as unknown as LookupRow[];
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

  async createSector(name: string) {
    const clean = (name ?? '').trim();
    if (!clean) throw new BadRequestException('Sector name is required.');
    const { data, error } = await this.db.client
      .from('sectors')
      .insert({ name: clean })
      .select('id, name')
      .single();
    if (error) throw toHttpException(error, 'lookups.createSector');
    this.cache.delete('sectors');
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
