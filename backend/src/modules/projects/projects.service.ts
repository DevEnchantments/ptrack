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
import { MilestonesService } from '../milestones/milestones.service';
import { ProgramOutcomesService } from '../program-outcomes/program-outcomes.service';
import { ActionItemsService } from '../action-items/action-items.service';
import { LinksService } from '../links/links.service';
import { ResourcesService } from '../resources/resources.service';
import { IssuesService } from '../issues/issues.service';
import { RisksService } from '../risks/risks.service';
import { SubmissionsService } from '../submissions/submissions.service';
import { NotificationsService } from '../notifications/notifications.service';
import { UpdatesService } from '../updates/updates.service';
import { StatusReportsService } from '../status-reports/status-reports.service';
import { AttachmentsService } from '../attachments/attachments.service';

@Injectable()
export class ProjectsService {
  constructor(
    private readonly repo: ProjectsRepository,
    private readonly milestones: MilestonesService,
    private readonly outcomes: ProgramOutcomesService,
    private readonly actionItems: ActionItemsService,
    private readonly links: LinksService,
    private readonly resources: ResourcesService,
    private readonly issues: IssuesService,
    private readonly risks: RisksService,
    private readonly submissions: SubmissionsService,
    private readonly notifications: NotificationsService,
    private readonly updates: UpdatesService,
    private readonly statusReports: StatusReportsService,
    private readonly attachments: AttachmentsService,
  ) {}

  /**
   * All eight section lists in one response so the project page costs a single
   * request instead of eight. The queries run concurrently; each section's own
   * endpoint still exists for per-section refreshes after a save.
   */
  async sections(projectId: string) {
    const [
      milestones,
      outcomes,
      actionItems,
      links,
      resources,
      issues,
      risks,
      submissions,
      updates,
      statusReports,
      attachments,
    ] = await Promise.all([
      this.milestones.list(projectId),
      this.outcomes.list(projectId),
      this.actionItems.list(projectId),
      this.links.list(projectId),
      this.resources.list(projectId),
      this.issues.list(projectId),
      this.risks.list(projectId),
      this.submissions.list(projectId),
      this.updates.list(projectId),
      this.statusReports.list(projectId),
      this.attachments.list(projectId),
    ]);
    return {
      milestones,
      outcomes,
      actionItems,
      links,
      resources,
      issues,
      risks,
      submissions,
      updates,
      statusReports,
      attachments,
    };
  }

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
    // FDD 3.9 budget-threshold notification (ASSUMED at 80% — OI question):
    // capture prior utilization only when a budget field is changing.
    const budgetTouched =
      dto.utilized_budget !== undefined || dto.approved_budget !== undefined;
    const prior = budgetTouched ? await this.repo.findDetail(id) : null;

    const patch: Record<string, unknown> = { updated_by: userId };
    if (dto.name !== undefined) patch.name = dto.name.trim();
    if (dto.parent_project_id !== undefined)
      patch.parent_project_id = dto.parent_project_id ?? null;
    if (dto.status_id !== undefined) patch.status_id = dto.status_id ?? null;
    if (dto.size_id !== undefined) patch.size_id = dto.size_id ?? null;
    if (dto.category_id !== undefined)
      patch.category_id = dto.category_id ?? null;
    if (dto.access_control !== undefined)
      patch.access_control = dto.access_control;
    if (dto.description !== undefined)
      patch.description = dto.description?.trim() || null;
    if (dto.goal !== undefined) patch.goal = dto.goal?.trim() || null;
    if (dto.customer !== undefined)
      patch.customer = dto.customer?.trim() || null;
    if (dto.primary_url !== undefined)
      patch.primary_url = dto.primary_url?.trim() || null;
    if (dto.tags !== undefined) patch.tags = dto.tags?.length ? dto.tags : null;
    if (dto.start_date !== undefined) patch.start_date = dto.start_date || null;
    // FDD Stage-1 fields (docs/FDD-ALIGNMENT.md section 1.1).
    if (dto.reference_id !== undefined)
      patch.reference_id = dto.reference_id?.trim() || null;
    if (dto.project_number !== undefined)
      patch.project_number = dto.project_number?.trim() || null;
    if (dto.plan_year !== undefined) patch.plan_year = dto.plan_year ?? null;
    if (dto.finance_code !== undefined)
      patch.finance_code = dto.finance_code?.trim() || null;
    if (dto.target_group !== undefined)
      patch.target_group = dto.target_group?.trim() || null;
    if (dto.internal_stakeholder !== undefined)
      patch.internal_stakeholder = dto.internal_stakeholder?.trim() || null;
    if (dto.is_priority !== undefined) patch.is_priority = dto.is_priority;
    if (dto.approved_budget !== undefined)
      patch.approved_budget = dto.approved_budget ?? null;
    if (dto.utilized_budget !== undefined)
      patch.utilized_budget = dto.utilized_budget ?? null;
    if (dto.tier_id !== undefined) patch.tier_id = dto.tier_id ?? null;
    if (dto.strategic_objective_id !== undefined)
      patch.strategic_objective_id = dto.strategic_objective_id ?? null;
    if (dto.manual_progress !== undefined)
      patch.manual_progress = dto.manual_progress ?? null;
    if (dto.at_risk !== undefined) patch.at_risk = dto.at_risk ?? false;
    if (dto.owner_id !== undefined) patch.owner_id = dto.owner_id ?? null;
    if (dto.project_manager_id !== undefined)
      patch.project_manager_id = dto.project_manager_id ?? null;
    if (dto.project_manager2_id !== undefined)
      patch.project_manager2_id = dto.project_manager2_id ?? null;
    if (dto.pmo_partner_id !== undefined)
      patch.pmo_partner_id = dto.pmo_partner_id ?? null;
    if (dto.external_stakeholders !== undefined)
      patch.external_stakeholders = dto.external_stakeholders?.length
        ? dto.external_stakeholders
        : null;
    if (dto.sector_id !== undefined) patch.sector_id = dto.sector_id ?? null;
    if (dto.deal_type_id !== undefined)
      patch.deal_type_id = dto.deal_type_id ?? null;
    if (dto.strategic_program_id !== undefined)
      patch.strategic_program_id = dto.strategic_program_id ?? null;
    if (dto.sponsor !== undefined) patch.sponsor = dto.sponsor?.trim() || null;
    if (dto.target_end_date !== undefined)
      patch.target_end_date = dto.target_end_date || null;

    await this.repo.update(id, patch);
    const updated = await this.getDetail(id);

    if (prior) {
      const ratio = (p: {
        approved_budget: number | null;
        utilized_budget: number | null;
      }) =>
        p.approved_budget != null &&
        p.approved_budget > 0 &&
        p.utilized_budget != null
          ? p.utilized_budget / p.approved_budget
          : null;
      const before = ratio(prior);
      const after = ratio(updated);
      const THRESHOLD = 0.8;
      if (
        after != null &&
        after >= THRESHOLD &&
        (before == null || before < THRESHOLD)
      ) {
        for (const uid of new Set([
          updated.owner_id,
          updated.project_manager_id,
        ])) {
          await this.notifications.notify({
            userId: uid,
            actorId: userId,
            projectId: id,
            type: 'budget_threshold',
            title: `${updated.name} reached ${Math.round(after * 100)}% budget utilization`,
            body: `AED ${updated.utilized_budget?.toLocaleString()} of AED ${updated.approved_budget?.toLocaleString()} used.`,
          });
        }
      }
    }
    return updated;
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
