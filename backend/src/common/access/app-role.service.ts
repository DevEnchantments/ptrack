import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { AppRole, isAppRole } from './access.logic';

const TTL_MS = 60_000;

/**
 * Resolves a user's global role (profiles.app_role, db/app_role.sql) with a
 * short in-memory cache — same convention as the lookups cache. Fail-safe:
 * an unreadable role (migration not yet run, transient error) resolves to
 * plain 'user', which locks the admin surfaces rather than opening them.
 */
@Injectable()
export class AppRoleService {
  private readonly logger = new Logger(AppRoleService.name);
  private readonly cache = new Map<string, { role: AppRole; at: number }>();
  private warnedMissing = false;

  constructor(private readonly db: DatabaseService) {}

  /** Role edits in Users & Roles must take effect immediately. */
  clearUser(userId: string): void {
    this.cache.delete(userId);
  }

  async getRole(userId: string): Promise<AppRole> {
    const hit = this.cache.get(userId);
    if (hit && Date.now() - hit.at < TTL_MS) return hit.role;

    let role: AppRole = 'user';
    const { data, error } = await this.db.client
      .from('profiles')
      .select('app_role')
      .eq('id', userId)
      .maybeSingle<{ app_role: string }>();
    if (error) {
      if (!this.warnedMissing) {
        this.warnedMissing = true;
        this.logger.warn(
          `app_role unreadable (db/app_role.sql not run yet?) — treating everyone as 'user': ${error.message}`,
        );
      }
    } else if (data && isAppRole(data.app_role)) {
      role = data.app_role;
    }

    this.cache.set(userId, { role, at: Date.now() });
    return role;
  }
}
