import { Global, Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { RecordHistoryService } from './record-history.service';

/**
 * Global so any feature module can inject DatabaseService without importing
 * this module explicitly. One Supabase client, shared across the whole app.
 */
@Global()
@Module({
  providers: [DatabaseService, RecordHistoryService],
  exports: [DatabaseService, RecordHistoryService],
})
export class DatabaseModule {}
