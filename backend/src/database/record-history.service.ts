import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from './database.service';

/**
 * Writes audit rows the record_history TRIGGER cannot: deletions. A row-level
 * trigger fires on DELETE, but OLD.updated_by names the last *editor*, not the
 * deleter — only the service layer knows who asked. Field-level change capture
 * stays in the trigger (db/record_history.sql); this service only logs
 * `event = 'deleted'`.
 *
 * Best-effort by design: the record is already gone when this runs, so a
 * failed audit insert must not turn a successful DELETE into a 500. Failures
 * are logged, not thrown (same policy as Storage cleanup on project delete).
 */
@Injectable()
export class RecordHistoryService {
  private readonly logger = new Logger(RecordHistoryService.name);

  constructor(private readonly db: DatabaseService) {}

  async logDeleted(entry: {
    table: string;
    recordId: string;
    projectId: string;
    /** Display text of what was deleted, e.g. the link label or issue title. */
    label: string | null;
    userId: string;
  }): Promise<void> {
    const { error } = await this.db.client.from('record_history').insert({
      table_name: entry.table,
      record_id: entry.recordId,
      project_id: entry.projectId,
      event: 'deleted',
      old_value: entry.label ?? '',
      new_value: '',
      changed_by: entry.userId,
    });
    if (error) {
      this.logger.warn(
        `Could not log deletion of ${entry.table}/${entry.recordId}: ` +
          `${error.message}. If this is a check-constraint violation, run ` +
          `db/record_history_deleted.sql in the Supabase SQL editor.`,
      );
    }
  }
}
