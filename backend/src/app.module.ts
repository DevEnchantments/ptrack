import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { DatabaseModule } from './database/database.module';
import { SupabaseAuthGuard } from './common/guards/supabase-auth.guard';
import { ProjectsModule } from './modules/projects/projects.module';
import { UsersModule } from './modules/users/users.module';
import { LookupsModule } from './modules/lookups/lookups.module';
import { PeopleModule } from './modules/people/people.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    ProjectsModule,
    UsersModule,
    LookupsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: SupabaseAuthGuard },
  ],
})
export class AppModule {}