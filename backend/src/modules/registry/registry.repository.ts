import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { toHttpException } from '../../common/supabase-error';
import type {
  GlobalActionItem,
  GlobalMilestone,
  MemberRow,
} from './registry.types';

/**
 * Cross-project reads for the global registers.
 *
 * Extracted from the service (REFACTOR-PLAN v2, Phase 0) so the visibility
 * filtering and the people-directory grouping above it can be tested. The
 * repository fetches everything; deciding what the caller may see is policy and
 * stays in the service.
 */
@Injectable()
export class RegistryRepository {
  constructor(private readonly db: DatabaseService) {}

  async allMilestones(): Promise<GlobalMilestone[]> {
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
    return (data ?? []) as unknown as GlobalMilestone[];
  }

  async allActionItems(): Promise<GlobalActionItem[]> {
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
    return (data ?? []) as unknown as GlobalActionItem[];
  }

  async allMemberships(): Promise<MemberRow[]> {
    const { data, error } = await this.db.client.from('project_members').select(
      `project_id, user_id, pending_name, pending_email, access_level, status,
         role:project_roles ( name ),
         profile:profiles!user_id ( full_name, email ),
         project:projects ( name )`,
    );
    if (error) throw toHttpException(error, 'registry.people');
    return (data ?? []) as unknown as MemberRow[];
  }
}
