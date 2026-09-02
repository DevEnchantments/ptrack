import { BadRequestException, Injectable } from '@nestjs/common';
import { planClaim, type PendingMembershipRow } from './users.logic';
import type { AuthUser } from '../../common/decorators/current-user.decorator';
import { ProvisionUserDto } from './dto/provision-user.dto';
import { DatabaseService } from '../../database/database.service';
import { ProjectAccessService } from '../../common/access/project-access.service';
import { toHttpException } from '../../common/supabase-error';

@Injectable()
export class UsersService {
  constructor(
    private readonly db: DatabaseService,
    private readonly access: ProjectAccessService,
  ) {}

  /** Projects the caller belongs to, with role and access tier. */
  async myMemberships(userId: string) {
    const { data, error } = await this.db.client
      .from('project_members')
      .select(
        `access_level, status,
         role:project_roles ( name ),
         project:projects ( id, name )`,
      )
      .eq('user_id', userId)
      .eq('status', 'active');
    if (error) throw toHttpException(error, 'users.myMemberships');
    return data ?? [];
  }

  /** Open records assigned to the caller, for the profile page's work list. */
  async myWork(userId: string) {
    const owned = await this.db.client
      .from('action_item_owners')
      .select('action_item_id')
      .eq('user_id', userId);
    if (owned.error) throw toHttpException(owned.error, 'users.myWork');
    const ids = (owned.data ?? []).map(
      (r: { action_item_id: string }) => r.action_item_id,
    );

    const [actionItems, milestones, risks] = await Promise.all([
      ids.length === 0
        ? Promise.resolve({ data: [], error: null })
        : this.db.client
            .from('action_items')
            .select(
              'id, project_id, title, due_date, project:projects ( name )',
            )
            .in('id', ids)
            .eq('status', 'open')
            .order('due_date', { ascending: true, nullsFirst: false }),
      this.db.client
        .from('milestones')
        .select('id, project_id, name, due_date, project:projects ( name )')
        .eq('owner_id', userId)
        .eq('status', 'open')
        .order('due_date', { ascending: true, nullsFirst: false }),
      this.db.client
        .from('risks')
        .select(
          'id, project_id, statement, status, type, project:projects ( name )',
        )
        .eq('owner_id', userId)
        .eq('status', 'open'),
    ]);
    for (const r of [actionItems, milestones, risks]) {
      if (r.error) throw toHttpException(r.error, 'users.myWork');
    }
    return {
      action_items: actionItems.data ?? [],
      milestones: milestones.data ?? [],
      risks: risks.data ?? [],
    };
  }

  /** Own profile row (display name for /users/me). */
  async myProfile(userId: string) {
    const { data, error } = await this.db.client
      .from('profiles')
      .select('full_name')
      .eq('id', userId)
      .maybeSingle<{ full_name: string | null }>();
    if (error) throw toHttpException(error, 'users.myProfile');
    return data ?? { full_name: null };
  }

  /** Own display name; drives attribution in history and notifications. */
  async updateMe(userId: string, fullName: string) {
    const { data, error } = await this.db.client
      .from('profiles')
      .update({ full_name: fullName.trim() || null })
      .eq('id', userId)
      .select('id, email, full_name')
      .single<{ id: string; email: string | null; full_name: string | null }>();
    if (error) throw toHttpException(error, 'users.updateMe');
    return data;
  }

  /** Existing application users (profiles), optionally filtered by search text. */
  async search(query?: string) {
    let q = this.db.client
      .from('profiles')
      .select('id, full_name, email')
      .order('full_name', { ascending: true })
      .limit(20);

    const term = query?.trim();
    if (term) {
      q = q.or(`full_name.ilike.%${term}%,email.ilike.%${term}%`);
    }

    const { data, error } = await q;
    if (error) throw toHttpException(error, 'users.search');
    return data ?? [];
  }

  /**
   * Admin account creation (Supabase Admin API, service role — no email
   * infrastructure involved). Creates the auth user pre-confirmed, ensures
   * the profile row exists, then claims every pending membership whose
   * pending_email matches.
   */
  async provision(dto: ProvisionUserDto, actorId: string) {
    const email = dto.email.trim().toLowerCase();
    const fullName = dto.full_name.trim();
    const { data: created, error } = await this.db.client.auth.admin.createUser(
      {
        email,
        password: dto.password,
        email_confirm: true,
        user_metadata: { full_name: fullName, provisioned_by: actorId },
      },
    );
    if (error) throw new BadRequestException(error.message);
    const userId = created.user.id;

    // Profiles are populated "via a trigger on auth.users, or from the
    // backend on first login" (schema note) — an explicit upsert covers both
    // installs deterministically.
    const profile = await this.db.client
      .from('profiles')
      .upsert({ id: userId, full_name: fullName, email }, { onConflict: 'id' });
    if (profile.error) throw toHttpException(profile.error, 'users.provision');

    const claimed = await this.claimByEmail(email, userId);
    return { user_id: userId, email, full_name: fullName, claimed };
  }

  /** First-login hook: link any pending memberships to the signed-in user. */
  async claimForCurrentUser(user: AuthUser) {
    if (!user.email) return { claimed: 0 };
    const email = user.email.trim().toLowerCase();
    // Insert-if-missing profile so brand-new self-registered users work too.
    const profile = await this.db.client
      .from('profiles')
      .upsert(
        { id: user.id, email },
        { onConflict: 'id', ignoreDuplicates: true },
      );
    if (profile.error) throw toHttpException(profile.error, 'users.claim');
    return { claimed: await this.claimByEmail(email, user.id) };
  }

  private async claimByEmail(email: string, userId: string): Promise<number> {
    const pending = await this.db.client
      .from('project_members')
      .select('id, project_id')
      .is('user_id', null)
      .ilike('pending_email', email);
    if (pending.error) throw toHttpException(pending.error, 'users.claim');
    const rows = (pending.data ?? []) as PendingMembershipRow[];
    if (rows.length === 0) return 0;

    const existing = await this.db.client
      .from('project_members')
      .select('project_id')
      .eq('user_id', userId);
    if (existing.error) throw toHttpException(existing.error, 'users.claim');
    const { toUpdate, toDelete } = planClaim(
      rows,
      new Set(
        ((existing.data ?? []) as Array<{ project_id: string }>).map(
          (r) => r.project_id,
        ),
      ),
    );

    if (toUpdate.length > 0) {
      const { error } = await this.db.client
        .from('project_members')
        .update({
          user_id: userId,
          status: 'active',
          pending_name: null,
          pending_email: null,
        })
        .in('id', toUpdate);
      if (error) throw toHttpException(error, 'users.claim');
    }
    if (toDelete.length > 0) {
      const { error } = await this.db.client
        .from('project_members')
        .delete()
        .in('id', toDelete);
      if (error) throw toHttpException(error, 'users.claim');
    }
    // Claims may touch memberships across many projects at once.
    if (toUpdate.length > 0 || toDelete.length > 0) {
      this.access.invalidateMemberships();
    }
    return toUpdate.length;
  }
}
