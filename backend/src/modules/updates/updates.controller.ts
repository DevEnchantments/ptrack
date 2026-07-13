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
import { UpdatesService } from './updates.service';
import { CreateUpdateDto } from './dto/create-update.dto';
import { UpdateUpdateDto } from './dto/update-update.dto';
import {
  CurrentUser,
  type AuthUser,
} from '../../common/decorators/current-user.decorator';

@Controller('projects/:projectId/updates')
export class UpdatesController {
  constructor(private readonly updates: UpdatesService) {}

  @Get()
  list(@Param('projectId', ParseUUIDPipe) projectId: string) {
    return this.updates.list(projectId);
  }

  @Post()
  @ApiBody({
    type: CreateUpdateDto,
    examples: {
      minimal: {
        summary: 'Minimal — runs as-is',
        value: { body: 'Dry run completed against staging with no data loss.' },
      },
      full: {
        summary: 'Full — replace type_id first',
        description: 'type_id comes from GET /lookups/update-types.',
        value: {
          body: 'Dry run completed against staging with no data loss.',
          type_id: '00000000-0000-0000-0000-000000000000',
          is_gold: true,
          tags: ['migration'],
        },
      },
    },
  })
  add(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Body() dto: CreateUpdateDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.updates.add(projectId, dto, user.id);
  }

  @Patch(':updateId')
  @ApiBody({
    type: UpdateUpdateDto,
    examples: {
      partial: {
        summary: 'Partial — send only what changes',
        value: { is_gold: true },
      },
    },
  })
  update(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('updateId', ParseUUIDPipe) updateId: string,
    @Body() dto: UpdateUpdateDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.updates.update(projectId, updateId, dto, user.id);
  }

  @Delete(':updateId')
  remove(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('updateId', ParseUUIDPipe) updateId: string,
  ) {
    return this.updates.remove(projectId, updateId);
  }
}
