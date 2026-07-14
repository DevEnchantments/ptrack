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

  @Get(':milestoneId/history')
  history(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('milestoneId', ParseUUIDPipe) milestoneId: string,
  ) {
    return this.milestones.history(projectId, milestoneId);
  }

  @Post()
  @ApiBody({
    type: CreateMilestoneDto,
    examples: {
      minimal: {
        summary: 'Minimal — runs as-is',
        value: {
          name: 'Schema cutover complete',
          start_date: '2026-07-13',
          due_date: '2026-08-31',
          status: 'open',
        },
      },
      full: {
        summary: 'Full — replace the UUIDs first',
        description:
          'role_id comes from GET /lookups/project-roles; owner_id from GET /users.',
        value: {
          name: 'Schema cutover complete',
          start_date: '2026-07-13',
          due_date: '2026-08-31',
          status: 'open',
          role_id: '00000000-0000-0000-0000-000000000000',
          owner_id: '00000000-0000-0000-0000-000000000000',
          is_major: true,
          description: 'All tables migrated and verified.',
          tags: ['migration'],
          weightage: 20,
          percent_complete: 0,
        },
      },
    },
  })
  add(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Body() dto: CreateMilestoneDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.milestones.add(projectId, dto, user.id);
  }

  @Patch(':milestoneId')
  @ApiBody({
    type: UpdateMilestoneDto,
    examples: {
      partial: {
        summary: 'Partial — send only what changes',
        value: { percent_complete: 50, status: 'open' },
      },
    },
  })
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
