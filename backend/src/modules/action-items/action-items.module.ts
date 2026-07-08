import { Module } from '@nestjs/common';
import { ActionItemsController } from './action-items.controller';
import { ActionItemsService } from './action-items.service';
import { ActionItemsRepository } from './action-items.repository';

@Module({
  controllers: [ActionItemsController],
  providers: [ActionItemsService, ActionItemsRepository],
})
export class ActionItemsModule {}