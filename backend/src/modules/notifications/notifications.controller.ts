import { Controller, Get, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import {
  CurrentUser,
  type AuthUser,
} from '../../common/decorators/current-user.decorator';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notifications: NotificationsService) {}

  @Get()
  list(@CurrentUser() user: AuthUser) {
    return this.notifications.list(user.id);
  }

  @Post(':notificationId/read')
  async markRead(
    @Param('notificationId', ParseUUIDPipe) notificationId: string,
    @CurrentUser() user: AuthUser,
  ) {
    await this.notifications.markRead(user.id, notificationId);
    return { ok: true };
  }

  @Post('read-all')
  async markAllRead(@CurrentUser() user: AuthUser) {
    await this.notifications.markAllRead(user.id);
    return { ok: true };
  }
}
