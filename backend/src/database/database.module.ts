import { Global, Module } from '@nestjs/common';
import { DatabaseService } from './database.service';

/**
 * Global so any feature module can inject DatabaseService without importing
 * this module explicitly. One Supabase client, shared across the whole app.
 */
@Global()
@Module({
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
