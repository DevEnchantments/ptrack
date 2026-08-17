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
import { columnsFrom, type ColumnSpec } from '../../common/columns';

/** Which of the 35 updatable columns follows which normalization rule. */
const COLUMN_SPEC: ColumnSpec = {
  trimmed: ['name'],
  trimmedOrNull: [
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
  ],
  nullable: [
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
  ],
  dateOrNull: ['start_date', 'target_end_date'],
  arrayOrNull: ['tags', 'external_stakeholders'],
  asIs: ['access_control', 'is_priority'],
};

/**
 * The shared spec plus the one field with a rule of its own: at_risk falls
 * back to false rather than null.
 */
function projectColumns(dto: UpdateProjectDto): Record<string, unknown> {
  const cols = columnsFrom(dto, COLUMN_SPEC);
  if (dto.at_risk !== undefined) cols.at_risk = dto.at_risk ?? false;
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

    await this.repo.update(id, { updated_by: userId, ...projectColumns(dto) });
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
