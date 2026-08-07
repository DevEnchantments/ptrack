import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { NotificationsRepository } from './notifications.repository';
import { RemindersService } from './reminders.service';

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService, NotificationsRepository, RemindersService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
