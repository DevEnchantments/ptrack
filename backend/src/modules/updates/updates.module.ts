import { Module } from '@nestjs/common';
import { UpdatesController } from './updates.controller';
import { UpdatesService } from './updates.service';
import { UpdatesRepository } from './updates.repository';

@Module({
  controllers: [UpdatesController],
  providers: [UpdatesService, UpdatesRepository],
})
export class UpdatesModule {}
