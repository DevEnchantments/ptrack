import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { toHttpException } from '../../common/supabase-error';
import { ProjectsService } from '../projects';
import { MilestonesService } from '../milestones';
import { CreateProjectDto } from '../projects';
import { CreateMilestoneDto } from '../milestones';
import {
  INVALID,
  parseBoolValue,
  parseDateValue,
  parseMilestoneStatus,
  parseNumberValue,
  resolveLookup,
  type LookupOption,
} from './import.logic';

export interface ImportRowResult {
  row: number;
  name: string;
  status: 'created' | 'failed';
  error?: string;
}

export interface ImportSummary {
  created: number;
  failed: number;
  results: ImportRowResult[];
}

const BATCH = 5;

/**
 * Bulk CSV import (create-only). Rows arrive as {field: string} maps already
 * column-mapped by the wizard; this service is the authority — it resolves
 * lookup names, coerces dates/numbers, and inserts through the normal
 * entity services so defaults, audit fields, and history behave exactly like
 * manual creation. Per-row failures never abort the batch.
 */
@Injectable()
export class ImportService {
  constructor(
    private readonly db: DatabaseService,
    private readonly projects: ProjectsService,
    private readonly milestones: MilestonesService,
  ) {}

  private async lookupRows(table: string): Promise<LookupOption[]> {
    const { data, error } = await this.db.client.from(table).select('id, name');
    if (error) throw toHttpException(error, `import.lookup.${table}`);
    return data ?? [];
  }

  private async runBatched<T>(
    items: T[],
    run: (item: T, index: number) => Promise<ImportRowResult>,
  ): Promise<ImportRowResult[]> {
    const results: ImportRowResult[] = [];
    for (let i = 0; i < items.length; i += BATCH) {
      const chunk = items.slice(i, i + BATCH);
      results.push(
        ...(await Promise.all(chunk.map((item, k) => run(item, i + k)))),
      );
    }
    return results;
  }

  private summarize(results: ImportRowResult[]): ImportSummary {
    return {
      created: results.filter((r) => r.status === 'created').length,
      failed: results.filter((r) => r.status === 'failed').length,
      results,
    };
  }

  async importProjects(
    rows: Array<Record<string, string>>,
    userId: string,
  ): Promise<ImportSummary> {
    const [statuses, sectors, categories, dealTypes, tiers] = await Promise.all(
      [
        this.lookupRows('project_statuses'),
        this.lookupRows('sectors'),
        this.lookupRows('project_categories'),
        this.lookupRows('deal_types'),
        this.lookupRows('tiers'),
      ],
    );

    const results = await this.runBatched(rows, async (row, i) => {
      const name = (row.name ?? '').trim();
      if (!name)
        return {
          row: i + 1,
          name: '(empty)',
          status: 'failed' as const,
          error: 'Name is required.',
        };

      for (const key of ['start_date', 'target_end_date'] as const) {
        if (parseDateValue(row[key]) === INVALID)
          return {
            row: i + 1,
            name,
            status: 'failed' as const,
            error: `Invalid date in ${key}: "${row[key]}". Use yyyy-mm-dd or dd/mm/yyyy.`,
          };
      }
      for (const key of [
        'approved_budget',
        'utilized_budget',
        'plan_year',
      ] as const) {
        if (parseNumberValue(row[key]) === INVALID)
          return {
            row: i + 1,
            name,
            status: 'failed' as const,
            error: `Invalid number in ${key}: "${row[key]}".`,
          };
      }

      const dateOf = (k: string) => {
        const v = parseDateValue(row[k]);
        return v === INVALID ? undefined : (v ?? undefined);
      };
      const numOf = (k: string) => {
        const v = parseNumberValue(row[k]);
        return v === INVALID ? undefined : (v ?? undefined);
      };
      const tags = (row.tags ?? '')
        .split(/[;,]/)
        .map((t) => t.trim())
        .filter(Boolean);

      const dto: Partial<CreateProjectDto> = {
        name,
        description: row.description?.trim() || undefined,
        sponsor: row.sponsor?.trim() || undefined,
        reference_id: row.reference_id?.trim() || undefined,
        project_number: row.project_number?.trim() || undefined,
        start_date: dateOf('start_date'),
        target_end_date: dateOf('target_end_date'),
        plan_year: numOf('plan_year'),
        approved_budget: numOf('approved_budget'),
        utilized_budget: numOf('utilized_budget'),
        tags: tags.length ? tags : undefined,
        status_id: resolveLookup(row.status, statuses).id ?? undefined,
        sector_id: resolveLookup(row.sector, sectors).id ?? undefined,
        category_id: resolveLookup(row.category, categories).id ?? undefined,
        deal_type_id: resolveLookup(row.type, dealTypes).id ?? undefined,
        tier_id: resolveLookup(row.tier, tiers).id ?? undefined,
      };
      try {
        await this.projects.create(dto as CreateProjectDto, userId);
        return { row: i + 1, name, status: 'created' as const };
      } catch (err) {
        return {
          row: i + 1,
          name,
          status: 'failed' as const,
          error: (err as Error).message,
        };
      }
    });
    return this.summarize(results);
  }

  async importMilestones(
    rows: Array<Record<string, string>>,
    userId: string,
  ): Promise<ImportSummary> {
    const { data, error } = await this.db.client
      .from('projects')
      .select('id, name');
    if (error) throw toHttpException(error, 'import.projects');
    const projectByName = new Map(
      ((data ?? []) as LookupOption[]).map((p) => [
        p.name.trim().toLowerCase(),
        p.id,
      ]),
    );

    const results = await this.runBatched(rows, async (row, i) => {
      const name = (row.name ?? '').trim();
      if (!name)
        return {
          row: i + 1,
          name: '(empty)',
          status: 'failed' as const,
          error: 'Milestone name is required.',
        };
      const projectName = (row.project ?? '').trim();
      const projectId = projectByName.get(projectName.toLowerCase());
      if (!projectId)
        return {
          row: i + 1,
          name,
          status: 'failed' as const,
          error: projectName
            ? `Unknown project: "${projectName}".`
            : 'Project is required.',
        };

      for (const key of ['start_date', 'due_date'] as const) {
        if (parseDateValue(row[key]) === INVALID)
          return {
            row: i + 1,
            name,
            status: 'failed' as const,
            error: `Invalid date in ${key}: "${row[key]}". Use yyyy-mm-dd or dd/mm/yyyy.`,
          };
      }
      if (parseNumberValue(row.weightage) === INVALID)
        return {
          row: i + 1,
          name,
          status: 'failed' as const,
          error: `Invalid number in weightage: "${row.weightage}".`,
        };

      const dto: Partial<CreateMilestoneDto> = {
        name,
        description: row.description?.trim() || undefined,
        start_date: ((v) => (v === INVALID ? undefined : (v ?? undefined)))(
          parseDateValue(row.start_date),
        ),
        due_date: ((v) => (v === INVALID ? undefined : (v ?? undefined)))(
          parseDateValue(row.due_date),
        ),
        weightage: ((v) => (v === INVALID ? undefined : (v ?? undefined)))(
          parseNumberValue(row.weightage),
        ),
        is_major: parseBoolValue(row.is_major),
        status: parseMilestoneStatus(
          row.status,
        ) as CreateMilestoneDto['status'],
      };
      try {
        await this.milestones.add(projectId, dto as CreateMilestoneDto, userId);
        return { row: i + 1, name, status: 'created' as const };
      } catch (err) {
        return {
          row: i + 1,
          name,
          status: 'failed' as const,
          error: (err as Error).message,
        };
      }
    });
    return this.summarize(results);
  }
}
