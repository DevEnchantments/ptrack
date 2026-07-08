import {
  Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post,
} from '@nestjs/common';
import { MilestonesService } from './milestones.service';
import { CreateMilestoneDto } from './dto/create-milestone.dto';
import { UpdateMilestoneDto } from './dto/update-milestone.dto';
import {
  CurrentUser,
  type AuthUser,
} from '../../common/decorators/current-user.decorator';

@Controller('projects/:projectId/milestones')
export class MilestonesController {
  constructor(private readonly milestones: MilestonesService) {}

  @Get()
  list(@Param('projectId', ParseUUIDPipe) projectId: string) {
    return this.milestones.list(projectId);
  }

  @Get(':milestoneId')
  get(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('milestoneId', ParseUUIDPipe) milestoneId: string,
  ) {
    return this.milestones.get(projectId, milestoneId);
  }

  @Post()
  add(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Body() dto: CreateMilestoneDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.milestones.add(projectId, dto, user.id);
  }

  @Patch(':milestoneId')
  update(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('milestoneId', ParseUUIDPipe) milestoneId: string,
    @Body() dto: UpdateMilestoneDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.milestones.update(projectId, milestoneId, dto, user.id);
  }

  @Delete(':milestoneId')
  remove(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('milestoneId', ParseUUIDPipe) milestoneId: string,
  ) {
    return this.milestones.remove(projectId, milestoneId);
  }
}