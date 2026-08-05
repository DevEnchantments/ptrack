import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { toHttpException } from '../../common/supabase-error';

export interface AppNotification {
  id: string;
  user_id: string;
  project_id: string | null;
  type: string;
  title: string;
  body: string | null;
  read_at: string | null;
  created_at: string;
}

const COLUMNS =
  'id, user_id, project_id, type, title, body, read_at, created_at';

@Injectable()
export class NotificationsRepository {
  constructor(private readonly db: DatabaseService) {}

  private get table() {
    return this.db.client.from('notifications');
  }

  async listForUser(userId: string): Promise<AppNotification[]> {
    const { data, error } = await this.table
      .select(COLUMNS)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(30);
    if (error) throw toHttpException(error, 'notifications.list');
    return data ?? [];
  }

  async insert(row: Record<string, unknown>): Promise<void> {
    const { error } = await this.table.insert(row);
    if (error) throw toHttpException(error, 'notifications.insert');
  }

  async markRead(userId: string, notificationId: string): Promise<void> {
    const { error } = await this.table
      .update({ read_at: new Date().toISOString() })
      .eq('id', notificationId)
      .eq('user_id', userId)
      .is('read_at', null);
    if (error) throw toHttpException(error, 'notifications.markRead');
  }

  async markAllRead(userId: string): Promise<void> {
    const { error } = await this.table
      .update({ read_at: new Date().toISOString() })
      .eq('user_id', userId)
      .is('read_at', null);
    if (error) throw toHttpException(error, 'notifications.markAllRead');
  }
}
