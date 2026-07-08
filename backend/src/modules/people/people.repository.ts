import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { toHttpException } from '../../common/supabase-error';

const MEMBER_COLUMNS =
  'id, user_id, pending_name, role_id, status, access_level, involvement_level_id, notes';

@Injectable()
export class PeopleRepository {
  constructor(private readonly db: DatabaseService) {}

  private get table() {
    return this.db.client.from('project_members');
  }

  async insert(row: Record<string, unknown>) {
    const { data, error } = await this.table
      .insert(row)
      .select(MEMBER_COLUMNS)
      .single();
    if (error) throw toHttpException(error, 'people.insert');
    return data;
  }

  async update(
    projectId: string,
    memberId: string,
    patch: Record<string, unknown>,
  ) {
    const { data, error } = await this.table
      .update(patch)
      .eq('project_id', projectId)
      .eq('id', memberId)
      .select(MEMBER_COLUMNS)
      .single();
    if (error) throw toHttpException(error, 'people.update');
    return data;
  }

  async remove(projectId: string, memberId: string) {
    const { error } = await this.table
      .delete()
      .eq('project_id', projectId)
      .eq('id', memberId);
    if (error) throw toHttpException(error, 'people.remove');
  }
}