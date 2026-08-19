import { Injectable } from '@nestjs/common';
import { ProjectAccessService } from '../../common/access/project-access.service';
import { RegistryRepository } from './registry.repository';
import type {
  DirectoryPerson,
  GlobalActionItem,
  GlobalMilestone,
  MemberRow,
} from './registry.types';

export type {
  DirectoryMembership,
  DirectoryPerson,
  GlobalActionItem,
  GlobalMilestone,
} from './registry.types';

/**
 * Cross-project read-only registers (global Milestones / Action Items /
 * People pages). Writes stay with each entity's own feature module. Filters are
 * client-side at current data scale; add query params + pagination when volume
 * demands.
 *
 * Every register applies FR-15 the same way: fetch everything, then drop what
 * this caller may not see.
 */
@Injectable()
export class RegistryService {
  constructor(
    private readonly repo: RegistryRepository,
    private readonly access: ProjectAccessService,
  ) {}

  async milestones(userId: string): Promise<GlobalMilestone[]> {
    const rows = await this.repo.allMilestones();
    return this.visibleTo(userId, rows);
  }

  async actionItems(userId: string): Promise<GlobalActionItem[]> {
    const rows = await this.repo.allActionItems();
    return this.visibleTo(userId, rows);
  }

  async people(userId: string): Promise<DirectoryPerson[]> {
    const rows = await this.repo.allMemberships();
    // FR-15: memberships on hidden restricted projects disappear; a person
    // whose only membership is hidden disappears with them.
    return groupIntoDirectory(await this.visibleTo(userId, rows));
  }

  /** FR-15: rows belonging to restricted projects this caller cannot see. */
  private async visibleTo<T extends { project_id: string }>(
    userId: string,
    rows: T[],
  ): Promise<T[]> {
    const hidden = await this.access.hiddenProjectIds(userId);
    return hidden.size === 0
      ? rows
      : rows.filter((r) => !hidden.has(r.project_id));
  }
}

/**
 * Membership rows collapsed into one entry per person, sorted by name.
 *
 * People without an account are keyed by their pending name, so the same
 * invited person appearing on two projects is one directory entry rather than
 * two.
 */
function groupIntoDirectory(rows: MemberRow[]): DirectoryPerson[] {
  const people = new Map<string, DirectoryPerson>();
  for (const m of rows) {
    const key = m.user_id ?? `pending:${(m.pending_name ?? '').toLowerCase()}`;
    let person = people.get(key);
    if (!person) {
      person = {
        key,
        user_id: m.user_id,
        name:
          m.profile?.full_name ||
          m.profile?.email ||
          m.pending_name ||
          'Unknown',
        email: m.profile?.email ?? m.pending_email ?? null,
        pending: !m.user_id,
        memberships: [],
      };
      people.set(key, person);
    }
    person.memberships.push({
      project_id: m.project_id,
      project_name: m.project?.name ?? null,
      role: m.role?.name ?? null,
      access_level: m.access_level,
      status: m.status,
    });
  }
  return [...people.values()].sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }),
  );
}
