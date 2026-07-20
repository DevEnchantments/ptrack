import { Injectable, NotFoundException } from '@nestjs/common';
import {
  ProjectsRepository,
  Project,
  ProjectDetail,
} from './projects.repository';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { MilestonesService } from '../milestones/milestones.service';
import { ActionItemsService } from '../action-items/action-items.service';
import { LinksService } from '../links/links.service';
import { ResourcesService } from '../resources/resources.service';
import { IssuesService } from '../issues/issues.service';
import { UpdatesService } from '../updates/updates.service';
import { StatusReportsService } from '../status-reports/status-reports.service';
import { AttachmentsService } from '../attachments/attachments.service';

@Injectable()
export class ProjectsService {
  constructor(
    private readonly repo: ProjectsRepository,
    private readonly milestones: MilestonesService,
    private readonly actionItems: ActionItemsService,
    private readonly links: LinksService,
    private readonly resources: ResourcesService,
    private readonly issues: IssuesService,
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
      actionItems,
      links,
      resources,
      issues,
      updates,
      statusReports,
      attachments,
    ] = await Promise.all([
      this.milestones.list(projectId),
      this.actionItems.list(projectId),
      this.links.list(projectId),
      this.resources.list(projectId),
      this.issues.list(projectId),
      this.updates.list(projectId),
      this.statusReports.list(projectId),
      this.attachments.list(projectId),
    ]);
    return {
      milestones,
      actionItems,
      links,
      resources,
      issues,
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
  }): Promise<Project[]> {
    return this.repo.findAll(page);
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

    await this.repo.update(id, patch);
    return this.getDetail(id);
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
