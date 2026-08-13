import { Injectable, NotFoundException } from '@nestjs/common';
import {
  ProjectsRepository,
  Project,
  ProjectDetail,
  ProjectListRow,
  ProjectListStats,
} from './projects.repository';
import { plannedProgress } from '../../common/formulas';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { NotificationsService } from '../notifications/notifications.service';

/** Text columns: trimmed, and a blank one clears the column. */
const TRIMMED_OR_NULL = [
  'description',
  'goal',
  'customer',
  'primary_url',
  'reference_id',
  'project_number',
  'finance_code',
  'target_group',
  'internal_stakeholder',
  'sponsor',
] as const;

/**
 * Ids and numbers where an explicit null clears the column. `?? null`, never
 * `|| null`: on the numeric ones a zero is a value, not a blank.
 */
const NULLABLE = [
  'parent_project_id',
  'status_id',
  'size_id',
  'category_id',
  'plan_year',
  'approved_budget',
  'utilized_budget',
  'tier_id',
  'strategic_objective_id',
  'manual_progress',
  'owner_id',
  'project_manager_id',
  'project_manager2_id',
  'pmo_partner_id',
  'sector_id',
  'deal_type_id',
  'strategic_program_id',
] as const;

/** Dates: an empty string clears the column. */
const DATE_OR_NULL = ['start_date', 'target_end_date'] as const;

/** Arrays: an empty array clears the column. */
const ARRAY_OR_NULL = ['tags', 'external_stakeholders'] as const;

/** Written exactly as received. */
const AS_IS = ['access_control', 'is_priority'] as const;

/**
 * The single definition of how an update DTO maps onto columns: only keys that
 * were actually sent appear, each normalized by its category. Adding a field
 * means naming it in one list above.
 */
function columnsFrom(dto: UpdateProjectDto): Record<string, unknown> {
  const sent = dto as Record<string, unknown>;
  const cols: Record<string, unknown> = {};
  const has = (key: string) => sent[key] !== undefined;

  // Two fields have rules of their own: name is trimmed but never nulled, and
  // at_risk falls back to false rather than null.
  if (dto.name !== undefined) cols.name = dto.name.trim();
  if (dto.at_risk !== undefined) cols.at_risk = dto.at_risk ?? false;

  for (const key of TRIMMED_OR_NULL)
    if (has(key)) cols[key] = (sent[key] as string | null)?.trim() || null;
  for (const key of NULLABLE) if (has(key)) cols[key] = sent[key] ?? null;
  for (const key of DATE_OR_NULL) if (has(key)) cols[key] = sent[key] || null;
  for (const key of ARRAY_OR_NULL)
    if (has(key))
      cols[key] = (sent[key] as unknown[] | null)?.length ? sent[key] : null;
  for (const key of AS_IS) if (has(key)) cols[key] = sent[key];

  return cols;
}

/** FDD 3.9 budget-threshold notification (ASSUMED at 80% — OI question). */
const BUDGET_ALERT_THRESHOLD = 0.8;

/** Utilization as a 0-1 ratio, or null when it cannot be computed. */
function utilizationRatio(project: {
  approved_budget: number | null;
  utilized_budget: number | null;
}): number | null {
  return project.approved_budget != null &&
    project.approved_budget > 0 &&
    project.utilized_budget != null
    ? project.utilized_budget / project.approved_budget
    : null;
}

@Injectable()
export class ProjectsService {
  constructor(
    private readonly repo: ProjectsRepository,
    private readonly notifications: NotificationsService,
  ) {}

  async create(dto: CreateProjectDto, userId: string): Promise<Project> {
    const { members, ...projectFields } = dto;

    const project = await this.repo.insert({
      ...projectFields,
      created_by: userId,
      updated_by: userId,
    });

    const valid = (members ?? []).filter((m) => m.role_id);
    if (valid.length > 0) {
      const rows = valid.map((m) => ({
        project_id: project.id,
        user_id: m.user_id ?? null,
        pending_name: m.user_id ? null : (m.pending_name ?? null),
        role_id: m.role_id,
        access_type: 'assigned',
        status: m.user_id ? 'active' : 'pending',
        created_by: userId,
        updated_by: userId,
      }));
      try {
        await this.repo.insertMembers(rows);
      } catch (err) {
        await this.repo.delete(project.id);
        throw err;
      }
    }

    return project;
  }

  async findAll(page?: {
    limit?: number;
    offset?: number;
  }): Promise<
    Array<
      ProjectListRow & ProjectListStats & { planned_progress: number | null }
    >
  > {
    let projects: ProjectListRow[];
    let stats: Record<string, ProjectListStats>;
    if (page?.limit) {
      projects = await this.repo.findAll(page);
      stats = await this.repo.listStats(projects.map((p) => p.id));
    } else {
      // Concurrent: all-projects stats need no id list, and each Supabase
      // round-trip costs ~0.5s on the corporate network.
      [projects, stats] = await Promise.all([
        this.repo.findAll(),
        this.repo.listStats(null),
      ]);
    }
    return projects.map((p) => ({
      ...p,
      ...(stats[p.id] ?? {
        milestones_done: 0,
        milestones_total: 0,
        open_issues: 0,
        calculated_progress: null,
      }),
      // F2, docs/FORMULAS.md (PROVISIONAL).
      planned_progress: plannedProgress(p.start_date, p.target_end_date),
    }));
  }

  history(id: string) {
    return this.repo.findHistory(id);
  }

  async getDetail(id: string): Promise<ProjectDetail> {
    const project = await this.repo.findDetail(id);
    if (!project) throw new NotFoundException(`Project ${id} not found`);
    return project;
  }

  async update(
    id: string,
    dto: UpdateProjectDto,
    userId: string,
  ): Promise<ProjectDetail> {
    // The "before" snapshot is only worth a round-trip when a budget field is
    // changing — it exists solely for the threshold check below.
    const budgetTouched =
      dto.utilized_budget !== undefined || dto.approved_budget !== undefined;
    const prior = budgetTouched ? await this.repo.findDetail(id) : null;

    await this.repo.update(id, { updated_by: userId, ...columnsFrom(dto) });
    const updated = await this.getDetail(id);

    if (prior) await this.notifyBudgetThreshold(id, prior, updated, userId);
    return updated;
  }

  /** Fires once per distinct recipient, only on the crossing itself. */
  private async notifyBudgetThreshold(
    projectId: string,
    prior: ProjectDetail,
    updated: ProjectDetail,
    actorId: string,
  ): Promise<void> {
    const before = utilizationRatio(prior);
    const after = utilizationRatio(updated);
    if (after == null || after < BUDGET_ALERT_THRESHOLD) return;
    // Already over the line before this edit: not a crossing.
    if (before != null && before >= BUDGET_ALERT_THRESHOLD) return;

    for (const uid of new Set([updated.owner_id, updated.project_manager_id])) {
      await this.notifications.notify({
        userId: uid,
        actorId,
        projectId,
        type: 'budget_threshold',
        title: `${updated.name} reached ${Math.round(after * 100)}% budget utilization`,
        body: `AED ${updated.utilized_budget?.toLocaleString()} of AED ${updated.approved_budget?.toLocaleString()} used.`,
      });
    }
  }

  async remove(id: string): Promise<{ deleted: boolean }> {
    // Remove the project's files from Storage before the rows cascade away.
    // Best-effort: a storage hiccup shouldn't block deleting the project.
    try {
      await this.repo.deleteAttachmentObjects(id);
    } catch {
      /* ignore storage cleanup failures */
    }
    await this.repo.delete(id);
    return { deleted: true };
  }
}
