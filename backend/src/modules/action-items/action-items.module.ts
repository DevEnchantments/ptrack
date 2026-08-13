import { Module } from '@nestjs/common';
import { ActionItemsController } from './action-items.controller';
import { ActionItemsService } from './action-items.service';
import { ActionItemsRepository } from './action-items.repository';
import { AttachmentsModule } from '../attachments/attachments.module';

@Module({
  imports: [AttachmentsModule],
  controllers: [ActionItemsController],
  providers: [ActionItemsService, ActionItemsRepository],
  exports: [ActionItemsService],
})
export class ActionItemsModule {}
