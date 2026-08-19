import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { RecordHistoryService } from '../../database/record-history.service';
import { RisksRepository, RiskListItem } from './risks.repository';
import { CreateRiskDto } from './dto/create-risk.dto';
import { UpdateRiskDto } from './dto/update-risk.dto';
import { NotificationsService } from '../notifications';
import { ProjectsRepository } from '../projects';
import { RISK_HIGH_THRESHOLD, riskScore } from '../../common/formulas';
import { ProjectAccessService } from '../../common/access/project-access.service';
import { AccessLevel } from '../../common/access/access.logic';

@Injectable()
export class RisksService {
  private readonly logger = new Logger(RisksService.name);

  constructor(
    private readonly repo: RisksRepository,
    private readonly auditLog: RecordHistoryService,
    private readonly notifications: NotificationsService,
    private readonly projects: ProjectsRepository,
    private readonly access: ProjectAccessService,
  ) {}

  list(projectId: string) {
    return this.repo.findByProject(projectId);
  }

  /**
   * FDD 3.9 event alert: an open risk scoring in the F3 red band
   * (probability x impact >= 6) notifies the PM and project owner, once per
   * risk (the notification `type` is the dedup key). Best-effort — an alert
   * failure never fails the save that triggered it.
   */
  private async maybeAlertHighSeverity(
    projectId: string,
    risk: RiskListItem,
    actorId: string,
  ): Promise<void> {
    try {
      const score = riskScore(risk.probability, risk.impact);
      if (risk.status !== 'open' || score === null) return;
      if (score < RISK_HIGH_THRESHOLD) return;
      const type = `risk_high:${risk.id}`;
      if (await this.notifications.hasAnyOfType(type)) return;
      const project = await this.projects.findDetail(projectId);
      const label = risk.type === 'issue' ? 'issue' : 'risk';
      const statement =
        risk.statement.length > 90
          ? `${risk.statement.slice(0, 90)}…`
          : risk.statement;
      const recipients = new Set(
        [project?.project_manager_id, project?.owner_id].filter(
          (r): r is string => Boolean(r),
        ),
      );
      for (const userId of recipients) {
        await this.notifications.notify({
          userId,
          actorId,
          projectId,
          type,
          title: `High-severity ${label} in ${project?.name ?? 'a project'}`,
          body: `"${statement}" scored ${score}/9 (probability x impact).`,
        });
      }
    } catch (err) {
      this.logger.warn(
        `High-severity risk alert failed for ${risk.id}: ${
          (err as Error).message
        }`,
      );
    }
  }

  async add(projectId: string, dto: CreateRiskDto, userId: string) {
    const created = await this.repo.insert({
      project_id: projectId,
      statement: dto.statement.trim(),
      identified_by: dto.identified_by?.trim() || null,
      date_identified: dto.date_identified || null,
      source_id: dto.source_id ?? null,
      category_id: dto.category_id ?? null,
      owner_id: dto.owner_id ?? null,
      probability_id: dto.probability_id ?? null,
      impact_id: dto.impact_id ?? null,
      response_id: dto.response_id ?? null,
      response_plan: dto.response_plan?.trim() || null,
      priority: dto.priority?.trim() || null,
      action: dto.action?.trim() || null,
      status: dto.status ?? 'open',
      type: dto.type ?? 'risk',
      created_by: userId,
      updated_by: userId,
    });
    await this.maybeAlertHighSeverity(projectId, created, userId);
    return created;
  }

  async update(
    projectId: string,
    riskId: string,
    dto: UpdateRiskDto,
    userId: string,
  ) {
    // The route admits viewers so the risk's own owner can update it
    // (FDD role 4); everyone else still needs project write access.
    const level = await this.access.levelFor(userId, projectId);
    if (level < AccessLevel.Write) {
      const existing = await this.repo.findOne(projectId, riskId);
      if (!existing) throw new NotFoundException('Risk not found.');
      if (existing.owner_id !== userId) {
        throw new ForbiddenException(
          "Only this risk's owner or a project writer can update it.",
        );
      }
    }
    const patch: Record<string, unknown> = {
      updated_by: userId,
      // No moddatetime trigger on this table; keep the audit column honest.
      updated_at: new Date().toISOString(),
    };
    if (dto.statement !== undefined) patch.statement = dto.statement.trim();
    if (dto.identified_by !== undefined)
      patch.identified_by = dto.identified_by?.trim() || null;
    if (dto.date_identified !== undefined)
      patch.date_identified = dto.date_identified || null;
    if (dto.source_id !== undefined) patch.source_id = dto.source_id ?? null;
    if (dto.category_id !== undefined)
      patch.category_id = dto.category_id ?? null;
    if (dto.owner_id !== undefined) patch.owner_id = dto.owner_id ?? null;
    if (dto.probability_id !== undefined)
      patch.probability_id = dto.probability_id ?? null;
    if (dto.impact_id !== undefined) patch.impact_id = dto.impact_id ?? null;
    if (dto.response_id !== undefined)
      patch.response_id = dto.response_id ?? null;
    if (dto.response_plan !== undefined)
      patch.response_plan = dto.response_plan?.trim() || null;
    if (dto.priority !== undefined)
      patch.priority = dto.priority?.trim() || null;
    if (dto.action !== undefined) patch.action = dto.action?.trim() || null;
    if (dto.status !== undefined) patch.status = dto.status;
    if (dto.type !== undefined) patch.type = dto.type;
    const updated = await this.repo.update(projectId, riskId, patch);
    if (!updated) throw new NotFoundException('Risk not found.');
    await this.maybeAlertHighSeverity(projectId, updated, userId);
    return updated;
  }

  async remove(projectId: string, riskId: string, userId: string) {
    const deleted = await this.repo.remove(projectId, riskId);
    if (!deleted) throw new NotFoundException('Risk not found.');
    await this.auditLog.logDeleted({
      table: 'risks',
      recordId: deleted.id,
      projectId,
      label: deleted.label,
      userId,
    });
    return { deleted: true };
  }
}
