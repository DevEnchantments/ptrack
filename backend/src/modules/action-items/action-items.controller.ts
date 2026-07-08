import {
  Body, Controller, Get, Param, ParseUUIDPipe, Post,
} from '@nestjs/common';
import { ActionItemsService } from './action-items.service';
import { CreateActionItemDto } from './dto/create-action-item.dto';
import {
  CurrentUser,
  type AuthUser,
} from '../../common/decorators/current-user.decorator';
import { CreateCommentDto } from './dto/create-comment.dto';

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

  @Get(':actionItemId/comments')
  listComments(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('actionItemId', ParseUUIDPipe) actionItemId: string,
  ) {
    return this.actionItems.listComments(projectId, actionItemId);
  }

  @Post(':actionItemId/comments')
  addComment(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('actionItemId', ParseUUIDPipe) actionItemId: string,
    @Body() dto: CreateCommentDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.actionItems.addComment(
      projectId,
      actionItemId,
      dto.body,
      user.id,
    );
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