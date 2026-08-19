import { Injectable } from '@nestjs/common';
import { MilestonesService } from '../milestones';
import { ProgramOutcomesService } from '../program-outcomes';
import { ActionItemsService } from '../action-items';
import { LinksService } from '../links';
import { ResourcesService } from '../resources';
import { IssuesService } from '../issues';
import { RisksService } from '../risks';
import { SubmissionsService } from '../submissions';
import { UpdatesService } from '../updates';
import { StatusReportsService } from '../status-reports';
import { AttachmentsService } from '../attachments';

/**
 * The project page's single read: all eleven section lists in one response, so
 * the page costs one request instead of eleven. The queries run concurrently;
 * each section's own endpoint still exists for the per-section refresh after a
 * save.
 *
 * This deliberately lives outside ProjectsModule. The fan-out is the only
 * reason eleven domain modules would be imported at all, and importing them
 * into ProjectsModule is what forced RisksModule and SubmissionsModule to
 * inject ProjectsRepository directly to dodge a module cycle.
 */
@Injectable()
export class ProjectSectionsService {
  constructor(
    private readonly milestones: MilestonesService,
    private readonly outcomes: ProgramOutcomesService,
    private readonly actionItems: ActionItemsService,
    private readonly links: LinksService,
    private readonly resources: ResourcesService,
    private readonly issues: IssuesService,
    private readonly risks: RisksService,
    private readonly submissions: SubmissionsService,
    private readonly updates: UpdatesService,
    private readonly statusReports: StatusReportsService,
    private readonly attachments: AttachmentsService,
  ) {}

  async list(projectId: string) {
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
}
