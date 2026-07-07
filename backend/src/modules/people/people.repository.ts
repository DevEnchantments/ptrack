import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { toHttpException } from '../../common/supabase-error';

@Injectable()
export class PeopleRepository {
  constructor(private readonly db: DatabaseService) {}

  async insert(row: Record<string, unknown>) {
    const { data, error } = await this.db.client
      .from('project_members')
      .insert(row)
      .select(
        'id, user_id, pending_name, role_id, status, access_level, involvement_level_id, notes',
      )
      .single();
    if (error) throw toHttpException(error, 'people.insert');
    return data;
  }
}