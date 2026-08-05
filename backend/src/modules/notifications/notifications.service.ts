import { Injectable, Logger } from '@nestjs/common';
import { NotificationsRepository } from './notifications.repository';

/**
 * In-app notifications (FDD 3.9, channel ASSUMED in-app-first). Event-driven
 * producers call `notify` fire-and-forget: a notification failure must never
 * fail the action that triggered it.
 */
@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(private readonly repo: NotificationsRepository) {}

  list(userId: string) {
    return this.repo.listForUser(userId);
  }

  markRead(userId: string, notificationId: string) {
    return this.repo.markRead(userId, notificationId);
  }

  markAllRead(userId: string) {
    return this.repo.markAllRead(userId);
  }

  /** Best-effort insert; skips self-notifications and empty recipients. */
  async notify(entry: {
    userId: string | null | undefined;
    actorId?: string;
    projectId?: string | null;
    type: string;
    title: string;
    body?: string | null;
  }): Promise<void> {
    if (!entry.userId) return;
    if (entry.actorId && entry.userId === entry.actorId) return;
    try {
      await this.repo.insert({
        user_id: entry.userId,
        project_id: entry.projectId ?? null,
        type: entry.type,
        title: entry.title,
        body: entry.body ?? null,
      });
    } catch (err) {
      this.logger.warn(
        `Could not create notification "${entry.type}" for ${entry.userId}: ${
          (err as Error).message
        }`,
      );
    }
  }
}
