import {
  Body, Controller, Get, Param, ParseUUIDPipe, Post,
} from '@nestjs/common';
import { ActionItemsService } from './action-items.service';
import { CreateActionItemDto } from './dto/create-action-item.dto';
import {
  CurrentUser,
  type AuthUser,
} from '../../common/decorators/current-user.decorator';

@Controller('projects/:projectId/action-items')
export class ActionItemsController {
  constructor(private readonly actionItems: ActionItemsService) {}

  @Get()
  list(@Param('projectId', ParseUUIDPipe) projectId: string) {
    return this.actionItems.list(projectId);
  }

  @Get(':actionItemId')
  get(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('actionItemId', ParseUUIDPipe) actionItemId: string,
  ) {
    return this.actionItems.get(projectId, actionItemId);
  }

  @Post()
  add(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Body() dto: CreateActionItemDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.actionItems.add(projectId, dto, user.id);
  }
}