import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { LookupsRepository } from './lookups.repository';

const ALLOWED: Record<string, string> = {
  'project-roles': 'project_roles',
  'project-statuses': 'project_statuses',
  'project-sizes': 'project_sizes',
  'project-categories': 'project_categories',
  'deal-types': 'deal_types',
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

/** The shape the admin grid edits, whatever the code table. */
const ADMIN_SELECT = 'id, name, sort_order, is_active';

// Admin: per-table extra editable columns (everything else gets the common
// trio name/sort_order/is_active). Whitelist enforced server-side.
const EXTRA_COLUMNS: Record<string, string[]> = {
  project_statuses: ['color'],
  issue_levels: ['rank'],
  project_roles: ['default_access_level'],
};

export interface AdminLookupRow {
  id: string;
  name: string;
  sort_order: number | null;
  is_active: boolean;
  color?: string | null;
  rank?: number | null;
  default_access_level?: string;
  objective_id?: string | null;
}

export interface AdminLookupTable {
  rows: AdminLookupRow[];
  extras: string[];
}

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

  constructor(private readonly repo: LookupsRepository) {}

  async list(name: string) {
    const table = ALLOWED[name];
    if (!table) throw new NotFoundException(`Unknown lookup: ${name}`);

    const hit = this.cache.get(name);
    if (hit && hit.expires > Date.now()) return hit.data;

    const rows = await this.repo.listActive<LookupRow>(
      table,
      SELECTS[table] ?? 'id, name',
    );
    this.cache.set(name, { data: rows, expires: Date.now() + CACHE_TTL_MS });
    return rows;
  }

  async createCategory(name: string) {
    const clean = (name ?? '').trim();
    if (!clean) throw new BadRequestException('Category name is required.');
    const created = await this.repo.insert<{ id: string; name: string }>(
      'project_categories',
      { name: clean },
      'id, name',
    );
    this.cache.delete('project-categories');
    return created;
  }

  async createSector(name: string) {
    const clean = (name ?? '').trim();
    if (!clean) throw new BadRequestException('Sector name is required.');
    const created = await this.repo.insert<{ id: string; name: string }>(
      'sectors',
      { name: clean },
      'id, name',
    );
    this.cache.delete('sectors');
    return created;
  }

  async createRole(name: string, defaultAccessLevel: string) {
    const clean = (name ?? '').trim();
    if (!clean) throw new BadRequestException('Role name is required.');
    const level = ACCESS_LEVELS.includes(defaultAccessLevel)
      ? defaultAccessLevel
      : 'read_only';
    const created = await this.repo.insert<{ id: string; name: string }>(
      'project_roles',
      { name: clean, default_access_level: level },
      'id, name',
    );
    this.cache.delete('project-roles');
    return created;
  }

  /** Admin listing: every code table with all rows, inactive included. */
  async adminList(): Promise<Record<string, AdminLookupTable>> {
    const entries = await Promise.all(
      Object.entries(ALLOWED).map(async ([name, table]) => {
        const extras = EXTRA_COLUMNS[table] ?? [];
        const select = [
          'id, name, sort_order, is_active',
          ...extras,
          ...(table === 'strategic_programs' ? ['objective_id'] : []),
        ].join(', ');
        const rows = await this.repo.listAll<AdminLookupRow>(table, select);
        return [name, { rows, extras }] as const;
      }),
    );
    return Object.fromEntries(entries);
  }

  private tableFor(name: string): string {
    const table = ALLOWED[name];
    if (!table) throw new NotFoundException(`Unknown lookup: ${name}`);
    return table;
  }

  private extrasFor(
    table: string,
    dto: {
      color?: string | null;
      rank?: number | null;
      default_access_level?: string;
    },
  ): Record<string, unknown> {
    const allowed = EXTRA_COLUMNS[table] ?? [];
    const extras: Record<string, unknown> = {};
    for (const key of ['color', 'rank', 'default_access_level'] as const) {
      const value = dto[key];
      if (value === undefined) continue;
      if (!allowed.includes(key))
        throw new BadRequestException(
          `"${key}" does not apply to this code table.`,
        );
      extras[key] = value;
    }
    return extras;
  }

  async addValue(
    name: string,
    dto: {
      name: string;
      sort_order?: number;
      color?: string | null;
      rank?: number | null;
      default_access_level?: string;
    },
  ): Promise<AdminLookupRow> {
    const table = this.tableFor(name);
    const clean = (dto.name ?? '').trim();
    if (!clean) throw new BadRequestException('A value name is required.');
    const row: Record<string, unknown> = {
      name: clean,
      ...this.extrasFor(table, dto),
    };
    if (dto.sort_order !== undefined) row.sort_order = dto.sort_order;
    const created = await this.repo.insert<AdminLookupRow>(
      table,
      row,
      ADMIN_SELECT,
    );
    this.cache.delete(name);
    return created;
  }

  async updateValue(
    name: string,
    id: string,
    dto: {
      name?: string;
      sort_order?: number;
      is_active?: boolean;
      color?: string | null;
      rank?: number | null;
      default_access_level?: string;
    },
  ): Promise<AdminLookupRow> {
    const table = this.tableFor(name);
    const patch: Record<string, unknown> = this.extrasFor(table, dto);
    if (dto.name !== undefined) {
      const clean = dto.name.trim();
      if (!clean) throw new BadRequestException('A value name is required.');
      patch.name = clean;
    }
    if (dto.sort_order !== undefined) patch.sort_order = dto.sort_order;
    if (dto.is_active !== undefined) patch.is_active = dto.is_active;
    if (Object.keys(patch).length === 0)
      throw new BadRequestException('Nothing to update.');
    const updated = await this.repo.update<AdminLookupRow>(
      table,
      id,
      patch,
      ADMIN_SELECT,
    );
    if (!updated) throw new NotFoundException('Code table value not found.');
    this.cache.delete(name);
    return updated;
  }
}
