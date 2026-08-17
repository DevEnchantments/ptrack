import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { toHttpException } from '../../common/supabase-error';
import { AppRoleService } from '../../common/access/app-role.service';
import { CapabilityService } from '../../common/access/capability.service';
import {
  APP_ROLES,
  AppRole,
  CAPABILITIES,
  Capability,
  GRANTABLE_ROLES,
  GrantableRole,
  isAppRole,
  isCapability,
} from '../../common/access/access.logic';

export interface ProfileRow {
  id: string;
  email: string | null;
  full_name: string | null;
  app_role: AppRole;
}

/**
 * Users & Roles administration (FDD role 1: "configure ... roles").
 * Role assignments and grant edits are audited to access_audit —
 * record_history cannot hold them (its project_id is NOT NULL).
 */
@Injectable()
export class AccessAdminService {
  private readonly logger = new Logger(AccessAdminService.name);

  constructor(
    private readonly db: DatabaseService,
    private readonly roles: AppRoleService,
    private readonly capabilities: CapabilityService,
  ) {}

  async listUsers(): Promise<ProfileRow[]> {
    const { data, error } = await this.db.client
      .from('profiles')
      .select('id, email, full_name, app_role')
      .order('email');
    if (error) throw toHttpException(error, 'accessAdmin.listUsers');
    return data ?? [];
  }

  async updateRole(targetId: string, role: string, actorId: string) {
    if (!isAppRole(role)) {
      throw new BadRequestException(
        `app_role must be one of: ${APP_ROLES.join(', ')}.`,
      );
    }
    const { data: target, error } = await this.db.client
      .from('profiles')
      .select('id, email, app_role')
      .eq('id', targetId)
      .maybeSingle<{ id: string; email: string | null; app_role: string }>();
    if (error) throw toHttpException(error, 'accessAdmin.updateRole');
    if (!target) throw new NotFoundException('User not found.');
    if (target.app_role === role) return { id: targetId, app_role: role };

    // The system must always keep at least one admin who can undo mistakes.
    if (target.app_role === 'admin' && role !== 'admin') {
      const admins = await this.db.client
        .from('profiles')
        .select('id', { count: 'exact', head: true })
        .eq('app_role', 'admin');
      if (admins.error)
        throw toHttpException(admins.error, 'accessAdmin.updateRole');
      if ((admins.count ?? 0) <= 1) {
        throw new BadRequestException(
          'Cannot demote the last remaining admin.',
        );
      }
    }

    const updated = await this.db.client
      .from('profiles')
      .update({ app_role: role })
      .eq('id', targetId)
      .select('id, app_role')
      .maybeSingle<{ id: string; app_role: AppRole }>();
    if (updated.error)
      throw toHttpException(updated.error, 'accessAdmin.updateRole');
    if (!updated.data) throw new NotFoundException('User not found.');

    this.roles.clearUser(targetId);
    await this.audit(actorId, 'role_changed', target.email ?? targetId, {
      old: target.app_role,
      new: role,
    });
    return updated.data;
  }

  async getGrants() {
    const grants = await this.capabilities.grants();
    return {
      catalog: CAPABILITIES,
      grants: Object.fromEntries(
        GRANTABLE_ROLES.map((r) => [r, [...grants[r]].sort()]),
      ) as Record<GrantableRole, Capability[]>,
    };
  }

  async replaceGrants(role: string, capabilities: string[], actorId: string) {
    if (!GRANTABLE_ROLES.includes(role as GrantableRole)) {
      throw new BadRequestException(
        `Editable roles are: ${GRANTABLE_ROLES.join(', ')} (admin bypasses the grid).`,
      );
    }
    const invalid = capabilities.filter((c) => !isCapability(c));
    if (invalid.length > 0) {
      throw new BadRequestException(
        `Unknown capabilities: ${invalid.join(', ')}.`,
      );
    }
    const wanted = [...new Set(capabilities)] as Capability[];
    const before = [
      ...(await this.capabilities.grants())[role as GrantableRole],
    ].sort();

    // Replace wholesale — the grid submits the full set per role. Two steps
    // (not a transaction): worst interruption case is a role briefly missing
    // grants, repaired by resubmitting; acceptable for an admin surface.
    const del = await this.db.client
      .from('role_capabilities')
      .delete()
      .eq('role', role);
    if (del.error)
      throw toHttpException(del.error, 'accessAdmin.replaceGrants');
    if (wanted.length > 0) {
      const ins = await this.db.client
        .from('role_capabilities')
        .insert(wanted.map((capability) => ({ role, capability })));
      if (ins.error)
        throw toHttpException(ins.error, 'accessAdmin.replaceGrants');
    }

    this.capabilities.clearCache();
    await this.audit(actorId, 'grants_replaced', role, {
      old: before.join(','),
      new: [...wanted].sort().join(','),
    });
    return this.getGrants();
  }

  /** Best-effort: a failed audit insert never fails the change it records. */
  private async audit(
    actorId: string,
    action: string,
    target: string,
    values: { old: string; new: string },
  ): Promise<void> {
    const { error } = await this.db.client.from('access_audit').insert({
      actor_id: actorId,
      action,
      target,
      old_value: values.old,
      new_value: values.new,
    });
    if (error) {
      this.logger.warn(
        `access_audit insert failed (db/role_capabilities.sql run?): ${error.message}`,
      );
    }
  }
}
