import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { toHttpException } from '../../common/supabase-error';
import { ProjectAccessService } from '../../common/access/project-access.service';

export interface GlobalMilestone {
  id: string;
  project_id: string;
  name: string;
  due_date: string | null;
  status: string;
  is_major: boolean;
  weightage: number | null;
  percent_complete: number | null;
  completed_date: string | null;
  tags: string[] | null;
  project: { name: string } | null;
  owner: { full_name: string | null; email: string | null } | null;
  outcome: { name: string } | null;
}

export interface GlobalActionItem {
  id: string;
  project_id: string;
  title: string;
  due_date: string | null;
  status: string;
  tags: string[] | null;
  project: { name: string } | null;
  type: { name: string } | null;
  owners: Array<{
    slot: number;
    user_id: string;
    profile: { full_name: string | null; email: string | null } | null;
  }>;
}

export interface DirectoryMembership {
  project_id: string;
  project_name: string | null;
  role: string | null;
  access_level: string;
  status: string;
}

export interface DirectoryPerson {
  key: string;
  user_id: string | null;
  name: string;
  email: string | null;
  pending: boolean;
  memberships: DirectoryMembership[];
}

interface MemberRow {
  project_id: string;
  user_id: string | null;
  pending_name: string | null;
  pending_email: string | null;
  access_level: string;
  status: string;
  role: { name: string } | null;
  profile: { full_name: string | null; email: string | null } | null;
  project: { name: string } | null;
}

/**
 * Cross-project read-only registers (global Milestones / Action Items /
 * People pages). Same aggregation precedent as the dashboard module; writes
 * stay with each entity's own feature module. Filters are client-side at
 * current data scale; add query params + pagination when volume demands.
 */
@Injectable()
export class RegistryService {
  constructor(
    private readonly db: DatabaseService,
    private readonly access: ProjectAccessService,
  ) {}

  async milestones(userId: string): Promise<GlobalMilestone[]> {
    const { data, error } = await this.db.client
      .from('milestones')
      .select(
        `id, project_id, name, due_date, status, is_major, weightage,
         percent_complete, completed_date, tags,
         project:projects ( name ),
         owner:profiles!owner_id ( full_name, email ),
         outcome:program_outcomes ( name )`,
      )
      .order('due_date', { ascending: true, nullsFirst: false });
    if (error) throw toHttpException(error, 'registry.milestones');
    const hidden = await this.access.hiddenProjectIds(userId);
    return ((data ?? []) as unknown as GlobalMilestone[]).filter(
      (m) => !hidden.has(m.project_id),
    );
  }

  async actionItems(userId: string): Promise<GlobalActionItem[]> {
    const { data, error } = await this.db.client
      .from('action_items')
      .select(
        `id, project_id, title, due_date, status, tags,
         project:projects ( name ),
         type:action_item_types ( name ),
         owners:action_item_owners (
           slot, user_id,
           profile:profiles!user_id ( full_name, email )
         )`,
      )
      .order('due_date', { ascending: true, nullsFirst: false });
    if (error) throw toHttpException(error, 'registry.actionItems');
    const hidden = await this.access.hiddenProjectIds(userId);
    return ((data ?? []) as unknown as GlobalActionItem[]).filter(
      (a) => !hidden.has(a.project_id),
    );
  }

  async people(userId: string): Promise<DirectoryPerson[]> {
    const { data, error } = await this.db.client.from('project_members').select(
      `project_id, user_id, pending_name, pending_email, access_level, status,
         role:project_roles ( name ),
         profile:profiles!user_id ( full_name, email ),
         project:projects ( name )`,
    );
    if (error) throw toHttpException(error, 'registry.people');
    // FR-15: memberships on hidden restricted projects disappear; a person
    // whose only membership is hidden disappears with them.
    const hidden = await this.access.hiddenProjectIds(userId);

    const people = new Map<string, DirectoryPerson>();
    for (const m of (data ?? []) as unknown as MemberRow[]) {
      if (hidden.has(m.project_id)) continue;
      const key =
        m.user_id ?? `pending:${(m.pending_name ?? '').toLowerCase()}`;
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
}
