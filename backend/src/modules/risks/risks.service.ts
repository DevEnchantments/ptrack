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
import { columnsFrom, type ColumnSpec } from '../../common/columns';

/** How a risk DTO maps onto columns, for both create and update. */
const COLUMN_SPEC: ColumnSpec = {
  trimmed: ['statement'],
  trimmedOrNull: ['identified_by', 'response_plan', 'priority', 'action'],
  dateOrNull: ['date_identified'],
  nullable: [
    'source_id',
    'category_id',
    'owner_id',
    'probability_id',
    'impact_id',
    'response_id',
  ],
  asIs: ['status', 'type'],
};

/**
 * What a new risk gets for the columns the caller omitted. A risk starts open
 * and is a risk rather than an issue until told otherwise.
 */
const CREATE_DEFAULTS = {
  identified_by: null,
  date_identified: null,
  source_id: null,
  category_id: null,
  owner_id: null,
  probability_id: null,
  impact_id: null,
  response_id: null,
  response_plan: null,
  priority: null,
  action: null,
  status: 'open',
  type: 'risk',
};

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
      ...CREATE_DEFAULTS,
      ...columnsFrom(dto, COLUMN_SPEC),
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
    await this.assertMayUpdate(projectId, riskId, userId);
    const updated = await this.repo.update(projectId, riskId, {
      updated_by: userId,
      // No moddatetime trigger on this table; keep the audit column honest.
      updated_at: new Date().toISOString(),
      ...columnsFrom(dto, COLUMN_SPEC),
    });
    if (!updated) throw new NotFoundException('Risk not found.');
    await this.maybeAlertHighSeverity(projectId, updated, userId);
    return updated;
  }

  /**
   * FDD role 4: the route admits viewers so a risk's own owner can update it.
   * Everyone else needs project write access.
   */
  private async assertMayUpdate(
    projectId: string,
    riskId: string,
    userId: string,
  ): Promise<void> {
    const level = await this.access.levelFor(userId, projectId);
    if (level >= AccessLevel.Write) return;

    const existing = await this.repo.findOne(projectId, riskId);
    if (!existing) throw new NotFoundException('Risk not found.');
    if (existing.owner_id !== userId) {
      throw new ForbiddenException(
        "Only this risk's owner or a project writer can update it.",
      );
    }
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
