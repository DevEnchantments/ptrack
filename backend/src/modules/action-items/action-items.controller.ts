import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { ActionItemsService } from './action-items.service';
import { CreateActionItemDto } from './dto/create-action-item.dto';
import { UpdateActionItemDto } from './dto/update-action-item.dto';
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
  @ApiBody({
    type: CreateCommentDto,
    examples: {
      minimal: {
        summary: 'Minimal — runs as-is',
        value: { body: 'Rollback plan drafted — awaiting review from Ops.' },
      },
    },
  })
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
  @ApiBody({
    type: CreateActionItemDto,
    examples: {
      minimal: {
        summary: 'Minimal — runs as-is',
        value: {
          title: 'Draft the rollback plan',
          due_date: '2026-08-31',
          status: 'open',
        },
      },
      full: {
        summary: 'Full — replace the UUIDs first',
        description:
          "type_id from GET /lookups/action-item-types; role_id from /lookups/project-roles; milestone_id from this project's milestones; owner_ids from GET /users.",
        value: {
          title: 'Draft the rollback plan',
          due_date: '2026-08-31',
          status: 'open',
          milestone_id: '00000000-0000-0000-0000-000000000000',
          type_id: '00000000-0000-0000-0000-000000000000',
          role_id: '00000000-0000-0000-0000-000000000000',
          description: 'Cover both the data and app tiers.',
          tags: ['migration'],
          owner_ids: ['00000000-0000-0000-0000-000000000000'],
        },
      },
    },
  })
  add(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Body() dto: CreateActionItemDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.actionItems.add(projectId, dto, user.id);
  }

  @Patch(':actionItemId')
  @ApiBody({
    type: UpdateActionItemDto,
    examples: {
      partial: {
        summary: 'Partial — send only what changes',
        value: { status: 'closed_completed' },
      },
    },
  })
  update(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('actionItemId', ParseUUIDPipe) actionItemId: string,
    @Body() dto: UpdateActionItemDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.actionItems.update(projectId, actionItemId, dto, user.id);
  }

  @Delete(':actionItemId')
  remove(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('actionItemId', ParseUUIDPipe) actionItemId: string,
  ) {
    return this.actionItems.remove(projectId, actionItemId);
  }
}
