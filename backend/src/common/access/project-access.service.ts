import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { toHttpException } from '../supabase-error';
import { AppRoleService } from './app-role.service';
import { AccessLevel, atLeastRole, resolveProjectLevel } from './access.logic';

const TTL_MS = 30_000;

interface ProjectAccessRow {
  id: string;
  access_control: string;
  owner_id: string | null;
  project_manager_id: string | null;
  project_manager2_id: string | null;
  pmo_partner_id: string | null;
}

/**
 * Per-project effective access (FR-15). One short-cached read for the
 * project's people columns and one for the caller's membership; the pure
 * resolution lives in access.logic.ts.
 */
@Injectable()
export class ProjectAccessService {
  private readonly projectCache = new Map<
    string,
    { row: ProjectAccessRow | null; at: number }
  >();
  private readonly memberCache = new Map<
    string,
    { level: string | null; at: number }
  >();

  constructor(
    private readonly db: DatabaseService,
    private readonly roles: AppRoleService,
  ) {}

  /** A restricted project a user cannot see 404s — it must not leak existence. */
  async levelFor(userId: string, projectId: string): Promise<AccessLevel> {
    const [row, appRole] = await Promise.all([
      this.projectRow(projectId),
      this.roles.getRole(userId),
    ]);
    if (!row) throw new NotFoundException('Project not found.');
    const membershipLevel = await this.membershipLevel(userId, projectId);
    return resolveProjectLevel({
      appRole,
      userId,
      accessControl: row.access_control,
      ownerId: row.owner_id,
      projectManagerId: row.project_manager_id,
      projectManager2Id: row.project_manager2_id,
      pmoPartnerId: row.pmo_partner_id,
      membershipLevel,
    });
  }

  /**
   * Project ids the user must NOT see in lists/aggregates: restricted
   * projects with no relationship. Empty set for pmo/admin.
   * (Executives are treated like users here — OI question 3.)
   */
  async hiddenProjectIds(userId: string): Promise<Set<string>> {
    const role = await this.roles.getRole(userId);
    if (atLeastRole(role, 'pmo')) return new Set();

    const [restricted, memberships] = await Promise.all([
      this.db.client
        .from('projects')
        .select(
          'id, owner_id, project_manager_id, project_manager2_id, pmo_partner_id',
        )
        .eq('access_control', 'restricted'),
      this.db.client
        .from('project_members')
        .select('project_id')
        .eq('user_id', userId)
        .eq('status', 'active'),
    ]);
    if (restricted.error)
      throw toHttpException(restricted.error, 'access.hidden');
    if (memberships.error)
      throw toHttpException(memberships.error, 'access.hidden');

    const memberOf = new Set(
      (memberships.data ?? []).map((m: { project_id: string }) => m.project_id),
    );
    const hidden = new Set<string>();
    for (const p of (restricted.data ?? []) as ProjectAccessRow[]) {
      const related =
        memberOf.has(p.id) ||
        [
          p.owner_id,
          p.project_manager_id,
          p.project_manager2_id,
          p.pmo_partner_id,
        ].includes(userId);
      if (!related) hidden.add(p.id);
    }
    return hidden;
  }

  private async projectRow(
    projectId: string,
  ): Promise<ProjectAccessRow | null> {
    const hit = this.projectCache.get(projectId);
    if (hit && Date.now() - hit.at < TTL_MS) return hit.row;
    const { data, error } = await this.db.client
      .from('projects')
      .select(
        'id, access_control, owner_id, project_manager_id, project_manager2_id, pmo_partner_id',
      )
      .eq('id', projectId)
      .maybeSingle<ProjectAccessRow>();
    if (error) throw toHttpException(error, 'access.project');
    this.projectCache.set(projectId, { row: data ?? null, at: Date.now() });
    return data ?? null;
  }

  private async membershipLevel(
    userId: string,
    projectId: string,
  ): Promise<string | null> {
    const key = `${projectId}|${userId}`;
    const hit = this.memberCache.get(key);
    if (hit && Date.now() - hit.at < TTL_MS) return hit.level;
    const { data, error } = await this.db.client
      .from('project_members')
      .select('access_level')
      .eq('project_id', projectId)
      .eq('user_id', userId)
      .eq('status', 'active')
      .limit(1)
      .maybeSingle<{ access_level: string }>();
    if (error) throw toHttpException(error, 'access.membership');
    const level = data?.access_level ?? null;
    this.memberCache.set(key, { level, at: Date.now() });
    return level;
  }
}
