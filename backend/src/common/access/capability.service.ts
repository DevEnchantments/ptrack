import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { AppRoleService } from './app-role.service';
import {
  Capability,
  DEFAULT_GRANTS,
  GRANTABLE_ROLES,
  GrantableRole,
  isCapability,
} from './access.logic';

const TTL_MS = 60_000;

/**
 * Which role holds which capability — data (role_capabilities) with a short
 * cache, falling back to the code-seeded DEFAULT_GRANTS when the table is
 * unreadable (db/role_capabilities.sql not run yet). admin bypasses
 * capability checks entirely, by design: the system must never be
 * configurable into a state nobody can repair.
 */
@Injectable()
export class CapabilityService {
  private readonly logger = new Logger(CapabilityService.name);
  private cache: {
    grants: Record<GrantableRole, Set<Capability>>;
    at: number;
  } | null = null;
  private warnedMissing = false;

  constructor(
    private readonly db: DatabaseService,
    private readonly roles: AppRoleService,
  ) {}

  async has(userId: string, capability: Capability): Promise<boolean> {
    const role = await this.roles.getRole(userId);
    if (role === 'admin') return true;
    const grants = await this.grants();
    return grants[role]?.has(capability) ?? false;
  }

  async grants(): Promise<Record<GrantableRole, Set<Capability>>> {
    if (this.cache && Date.now() - this.cache.at < TTL_MS) {
      return this.cache.grants;
    }
    const grants = Object.fromEntries(
      GRANTABLE_ROLES.map((r) => [r, new Set<Capability>()]),
    ) as Record<GrantableRole, Set<Capability>>;

    const { data, error } = await this.db.client
      .from('role_capabilities')
      .select('role, capability');
    if (error) {
      if (!this.warnedMissing) {
        this.warnedMissing = true;
        this.logger.warn(
          `role_capabilities unreadable (db/role_capabilities.sql not run yet?) — using code defaults: ${error.message}`,
        );
      }
      for (const role of GRANTABLE_ROLES) {
        for (const cap of DEFAULT_GRANTS[role]) grants[role].add(cap);
      }
    } else {
      for (const row of (data ?? []) as Array<{
        role: string;
        capability: string;
      }>) {
        if (
          GRANTABLE_ROLES.includes(row.role as GrantableRole) &&
          isCapability(row.capability)
        ) {
          grants[row.role as GrantableRole].add(row.capability);
        }
      }
    }
    this.cache = { grants, at: Date.now() };
    return grants;
  }

  /** Grid edits must be visible immediately, not after the TTL. */
  clearCache(): void {
    this.cache = null;
  }
}
