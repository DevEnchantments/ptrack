import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { toHttpException } from '../../common/supabase-error';
import type { AppRole } from '../../common/access/access.logic';

export interface ProfileRow {
  id: string;
  email: string | null;
  full_name: string | null;
  app_role: AppRole;
}

/** Just enough of a profile to decide a role change. */
export interface ProfileRoleRow {
  id: string;
  email: string | null;
  app_role: string;
}

/**
 * Data access for the Users & Roles admin surface.
 *
 * Extracted from the service (REFACTOR-PLAN v2, Phase 0) so the rules above it
 * can be tested at all: with the queries inline there was no seam, and a test
 * could only assert on a mocked Supabase chain. Ten modules still have this
 * shape (FOLLOW-UPS F8).
 */
@Injectable()
export class AccessAdminRepository {
  constructor(private readonly db: DatabaseService) {}

  async listProfiles(): Promise<ProfileRow[]> {
    const { data, error } = await this.db.client
      .from('profiles')
      .select('id, email, full_name, app_role')
      .order('email');
    if (error) throw toHttpException(error, 'accessAdmin.listUsers');
    return data ?? [];
  }

  async findProfile(userId: string): Promise<ProfileRoleRow | null> {
    const { data, error } = await this.db.client
      .from('profiles')
      .select('id, email, app_role')
      .eq('id', userId)
      .maybeSingle<ProfileRoleRow>();
    if (error) throw toHttpException(error, 'accessAdmin.updateRole');
    return data ?? null;
  }

  async countAdmins(): Promise<number> {
    const { count, error } = await this.db.client
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .eq('app_role', 'admin');
    if (error) throw toHttpException(error, 'accessAdmin.updateRole');
    return count ?? 0;
  }

  /** Null when the profile disappeared between the read and this write. */
  async setAppRole(
    userId: string,
    role: AppRole,
  ): Promise<{ id: string; app_role: AppRole } | null> {
    const { data, error } = await this.db.client
      .from('profiles')
      .update({ app_role: role })
      .eq('id', userId)
      .select('id, app_role')
      .maybeSingle<{ id: string; app_role: AppRole }>();
    if (error) throw toHttpException(error, 'accessAdmin.updateRole');
    return data ?? null;
  }

  /**
   * Wholesale replace — the grid submits the full set per role. Two steps, not
   * a transaction: the worst interruption leaves a role briefly without grants,
   * repaired by resubmitting. Acceptable on an admin surface.
   */
  async replaceRoleCapabilities(
    role: string,
    capabilities: string[],
  ): Promise<void> {
    const del = await this.db.client
      .from('role_capabilities')
      .delete()
      .eq('role', role);
    if (del.error)
      throw toHttpException(del.error, 'accessAdmin.replaceGrants');
    if (capabilities.length === 0) return;

    const ins = await this.db.client
      .from('role_capabilities')
      .insert(capabilities.map((capability) => ({ role, capability })));
    if (ins.error)
      throw toHttpException(ins.error, 'accessAdmin.replaceGrants');
  }

  /**
   * Returns the failure message, or null on success. Audit writes are
   * best-effort by design, so this reports rather than throws: the caller logs
   * and carries on, and a failed audit never fails the change it records.
   */
  async insertAudit(entry: {
    actorId: string;
    action: string;
    target: string;
    oldValue: string;
    newValue: string;
  }): Promise<string | null> {
    const { error } = await this.db.client.from('access_audit').insert({
      actor_id: entry.actorId,
      action: entry.action,
      target: entry.target,
      old_value: entry.oldValue,
      new_value: entry.newValue,
    });
    return error ? error.message : null;
  }
}
