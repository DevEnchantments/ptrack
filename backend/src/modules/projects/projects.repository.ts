import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { toHttpException } from '../../common/supabase-error';
import {
  calculatedProgress,
  type MilestoneProgressRow,
} from '../../common/formulas';
import {
  PROJECT_HISTORY_SELECT,
  type HistoryEntry,
} from '../../common/record-history';
import { ATTACHMENTS_BUCKET } from '../attachments/attachments.repository';

export interface Project {
  id: string;
  name: string;
  description: string | null;
  parent_project_id: string | null;
  owner_id: string | null;
  sponsor: string | null;
  status_id: string | null;
  size_id: string | null;
  category_id: string | null;
  deal_type_id: string | null;
  region_id: string | null;
  country_id: string | null;
  access_control: string;
  goal: string | null;
  customer: string | null;
  tags: string[] | null;
  primary_url: string | null;
  start_date: string | null;
  target_end_date: string | null;
  actual_end_date: string | null;
  /** FDD Stage-1 fields (docs/FDD-ALIGNMENT.md section 1.1). */
  reference_id: string | null;
  project_number: string | null;
  plan_year: number | null;
  finance_code: string | null;
  target_group: string | null;
  internal_stakeholder: string | null;
  is_priority: boolean;
  approved_budget: number | null;
  utilized_budget: number | null;
  tier_id: string | null;
  strategic_objective_id: string | null;
  /** FDD register columns (Wave 1.1, ASSUMED semantics — see FDD-ALIGNMENT). */
  manual_progress: number | null;
  at_risk: boolean;
  /** FDD person fields (Wave 1.2; owner_id above doubles as Project Owner). */
  project_manager_id: string | null;
  project_manager2_id: string | null;
  pmo_partner_id: string | null;
  /** FDD Wave 1.3 (ASSUMED shapes — see FDD-ALIGNMENT). */
  external_stakeholders: string[] | null;
  sector_id: string | null;
  strategic_program_id: string | null;
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
}

/** Per-project aggregates carried by the list endpoint (home cards). */
export interface ProjectListStats {
  milestones_done: number;
  milestones_total: number;
  open_issues: number;
  /** F1, docs/FORMULAS.md (PROVISIONAL). Null when not computable. */
  calculated_progress: number | null;
}

export interface ProjectDetail extends Project {
  status: { name: string } | null;
  size: { name: string } | null;
  category: { name: string } | null;
  tier: { name: string } | null;
  strategic_objective: { name: string } | null;
  sector: { name: string } | null;
  strategic_program: { name: string } | null;
  owner: { full_name: string | null; email: string | null } | null;
  project_manager: { full_name: string | null; email: string | null } | null;
  project_manager2: { full_name: string | null; email: string | null } | null;
  pmo_partner: { full_name: string | null; email: string | null } | null;
  members: Array<{
    id: string;
    user_id: string | null;
    pending_name: string | null;
    role_id: string | null;
    access_level: string;
    involvement_level_id: string | null;
    notes: string | null;
    status: string;
    role: { name: string } | null;
    profile: { full_name: string | null; email: string | null } | null;
  }>;
}

const COLUMNS =
  'id, name, description, parent_project_id, owner_id, sponsor, status_id, size_id, category_id, deal_type_id, region_id, country_id, access_control, goal, customer, tags, primary_url, start_date, target_end_date, actual_end_date, reference_id, project_number, plan_year, finance_code, target_group, internal_stakeholder, is_priority, approved_budget, utilized_budget, tier_id, strategic_objective_id, manual_progress, at_risk, project_manager_id, project_manager2_id, pmo_partner_id, external_stakeholders, sector_id, strategic_program_id, created_by, updated_by, created_at, updated_at';

@Injectable()
export class ProjectsRepository {
  constructor(private readonly db: DatabaseService) {}

  private get table() {
    return this.db.client.from('projects');
  }

  async insert(row: Partial<Project>): Promise<Project> {
    const { data, error } = await this.table
      .insert(row)
      .select(COLUMNS)
      .single();
    if (error) throw toHttpException(error, 'projects.insert');
    return data;
  }

  async findAll(page?: {
    limit?: number;
    offset?: number;
  }): Promise<Project[]> {
    let query = this.table
      .select(COLUMNS)
      .order('created_at', { ascending: false });
    if (page?.limit) {
      const from = page.offset ?? 0;
      query = query.range(from, from + page.limit - 1);
    }
    const { data, error } = await query;
    if (error) throw toHttpException(error, 'projects.findAll');
    return data ?? [];
  }

  async findDetail(id: string): Promise<ProjectDetail | null> {
    const { data, error } = await this.table
      .select(
        `
        ${COLUMNS},
        status:project_statuses ( name ),
        size:project_sizes ( name ),
        category:project_categories ( name ),
        tier:tiers ( name ),
        strategic_objective:strategic_objectives ( name ),
        sector:sectors ( name ),
        strategic_program:strategic_programs ( name ),
        owner:profiles!owner_id ( full_name, email ),
        project_manager:profiles!project_manager_id ( full_name, email ),
        project_manager2:profiles!project_manager2_id ( full_name, email ),
        pmo_partner:profiles!pmo_partner_id ( full_name, email ),
        members:project_members (
          id, user_id, pending_name, role_id, access_level,
          involvement_level_id, notes, status,
          role:project_roles ( name ),
          profile:profiles!user_id ( full_name, email )
        )
      `,
      )
      .eq('id', id)
      .maybeSingle();
    if (error) throw toHttpException(error, 'projects.findDetail');
    return (data as unknown as ProjectDetail) ?? null;
  }

  /**
   * Aggregates for the list endpoint: milestone completion and open-issue
   * counts per project, computed from two grouped fetches (no schema change).
   * "Done" mirrors the milestone status enum; "open" excludes resolved/closed.
   */
  async listStats(
    projectIds: string[],
  ): Promise<Record<string, ProjectListStats>> {
    const stats: Record<string, ProjectListStats> = {};
    for (const id of projectIds) {
      stats[id] = {
        milestones_done: 0,
        milestones_total: 0,
        open_issues: 0,
        calculated_progress: null,
      };
    }
    if (projectIds.length === 0) return stats;

    const [ms, iss] = await Promise.all([
      this.db.client
        .from('milestones')
        .select('project_id, status, weightage, percent_complete')
        .in('project_id', projectIds),
      this.db.client
        .from('issues')
        .select('project_id, status')
        .in('project_id', projectIds),
    ]);
    if (ms.error) throw toHttpException(ms.error, 'projects.listStats');
    if (iss.error) throw toHttpException(iss.error, 'projects.listStats');

    const progressRows: Record<string, MilestoneProgressRow[]> = {};
    (ms.data ?? []).forEach(
      (r: { project_id: string } & MilestoneProgressRow) => {
        const s = stats[r.project_id];
        if (!s) return;
        s.milestones_total += 1;
        if (r.status === 'closed_completed') s.milestones_done += 1;
        (progressRows[r.project_id] ??= []).push(r);
      },
    );
    for (const id of projectIds) {
      stats[id].calculated_progress = calculatedProgress(
        progressRows[id] ?? [],
      );
    }
    (iss.data ?? []).forEach((r: { project_id: string; status: string }) => {
      const s = stats[r.project_id];
      if (!s) return;
      if (r.status !== 'resolved' && r.status !== 'closed') s.open_issues += 1;
    });
    return stats;
  }

  /** Project-wide audit feed (FR-03 Change History tab), newest first. */
  async findHistory(projectId: string): Promise<HistoryEntry[]> {
    const { data, error } = await this.db.client
      .from('record_history')
      .select(PROJECT_HISTORY_SELECT)
      .eq('project_id', projectId)
      .order('changed_at', { ascending: false })
      .limit(200);
    if (error) throw toHttpException(error, 'projects.findHistory');
    return (data ?? []) as unknown as HistoryEntry[];
  }

  async insertMembers(rows: Record<string, unknown>[]): Promise<void> {
    const { error } = await this.db.client.from('project_members').insert(rows);
    if (error) throw toHttpException(error, 'projectMembers.insert');
  }

  async update(id: string, patch: Record<string, unknown>): Promise<void> {
    const { error } = await this.table.update(patch).eq('id', id);
    if (error) throw toHttpException(error, 'projects.update');
  }

  /** Best-effort removal of this project's files from Storage (rows cascade in the DB). */
  async deleteAttachmentObjects(projectId: string): Promise<void> {
    const { data, error } = await this.db.client
      .from('attachments')
      .select('storage_path')
      .eq('project_id', projectId);
    if (error) throw toHttpException(error, 'projects.listAttachmentPaths');

    const paths = (data ?? [])
      .map((r: { storage_path: string | null }) => r.storage_path)
      .filter((p): p is string => Boolean(p));

    if (paths.length > 0) {
      await this.db.client.storage.from(ATTACHMENTS_BUCKET).remove(paths);
    }
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.table.delete().eq('id', id);
    if (error) throw toHttpException(error, 'projects.delete');
  }
}
