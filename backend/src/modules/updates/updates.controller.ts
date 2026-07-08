import {
  Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post,
} from '@nestjs/common';
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
  add(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Body() dto: CreateUpdateDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.updates.add(projectId, dto, user.id);
  }

  @Patch(':updateId')
  update(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('updateId', ParseUUIDPipe) updateId: string,
    @Body() dto: UpdateUpdateDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.updates.update(projectId, updateId, dto, user.id);
  }
}