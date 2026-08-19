import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { AppRoleService } from '../../common/access/app-role.service';
import { CapabilityService } from '../../common/access/capability.service';
import {
  AccessAdminRepository,
  type ProfileRow,
} from './access-admin.repository';
import {
  APP_ROLES,
  CAPABILITIES,
  Capability,
  GRANTABLE_ROLES,
  GrantableRole,
  isAppRole,
  isCapability,
} from '../../common/access/access.logic';

export type { ProfileRow };

/**
 * Users & Roles administration (FDD role 1: "configure ... roles").
 * Role assignments and grant edits are audited to access_audit —
 * record_history cannot hold them (its project_id is NOT NULL).
 */
@Injectable()
export class AccessAdminService {
  private readonly logger = new Logger(AccessAdminService.name);

  constructor(
    private readonly repo: AccessAdminRepository,
    private readonly roles: AppRoleService,
    private readonly capabilities: CapabilityService,
  ) {}

  listUsers(): Promise<ProfileRow[]> {
    return this.repo.listProfiles();
  }

  async updateRole(targetId: string, role: string, actorId: string) {
    if (!isAppRole(role)) {
      throw new BadRequestException(
        `app_role must be one of: ${APP_ROLES.join(', ')}.`,
      );
    }
    const target = await this.repo.findProfile(targetId);
    if (!target) throw new NotFoundException('User not found.');
    if (target.app_role === role) return { id: targetId, app_role: role };

    await this.assertAdminsRemain(target.app_role, role);

    const updated = await this.repo.setAppRole(targetId, role);
    if (!updated) throw new NotFoundException('User not found.');

    this.roles.clearUser(targetId);
    await this.audit(actorId, 'role_changed', target.email ?? targetId, {
      old: target.app_role,
      new: role,
    });
    return updated;
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

    await this.repo.replaceRoleCapabilities(role, wanted);

    this.capabilities.clearCache();
    await this.audit(actorId, 'grants_replaced', role, {
      old: before.join(','),
      new: [...wanted].sort().join(','),
    });
    return this.getGrants();
  }

  /**
   * The system must always keep at least one admin who can undo mistakes, so
   * the last one cannot demote themselves out of the role. Only a demotion
   * *from* admin costs a count; promotions never do.
   *
   * `newRole === 'admin'` is unreachable from `updateRole`, which returns
   * early when the role is unchanged — a mutation check proved removing it
   * changes nothing. It stays because this guard should hold on its own terms
   * rather than depend on the order of checks in its only caller today.
   */
  private async assertAdminsRemain(
    currentRole: string,
    newRole: string,
  ): Promise<void> {
    if (currentRole !== 'admin' || newRole === 'admin') return;
    if ((await this.repo.countAdmins()) <= 1) {
      throw new BadRequestException('Cannot demote the last remaining admin.');
    }
  }

  /** Best-effort: a failed audit insert never fails the change it records. */
  private async audit(
    actorId: string,
    action: string,
    target: string,
    values: { old: string; new: string },
  ): Promise<void> {
    const failure = await this.repo.insertAudit({
      actorId,
      action,
      target,
      oldValue: values.old,
      newValue: values.new,
    });
    if (failure) {
      this.logger.warn(
        `access_audit insert failed (db/role_capabilities.sql run?): ${failure}`,
      );
    }
  }
}
