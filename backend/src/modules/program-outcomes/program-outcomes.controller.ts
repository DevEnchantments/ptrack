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
import { ProgramOutcomesService } from './program-outcomes.service';
import { CreateProgramOutcomeDto } from './dto/create-program-outcome.dto';
import { UpdateProgramOutcomeDto } from './dto/update-program-outcome.dto';
import {
  CurrentUser,
  type AuthUser,
} from '../../common/decorators/current-user.decorator';
import { ProjectScoped } from '../../common/access/access.decorators';

@ProjectScoped()
@Controller('projects/:projectId/outcomes')
export class ProgramOutcomesController {
  constructor(private readonly outcomes: ProgramOutcomesService) {}

  @Get()
  list(@Param('projectId', ParseUUIDPipe) projectId: string) {
    return this.outcomes.list(projectId);
  }

  @Post()
  @ApiBody({
    type: CreateProgramOutcomeDto,
    examples: {
      minimal: {
        summary: 'Minimal — runs as-is (auto-numbered)',
        value: { name: 'Improved early-detection coverage' },
      },
      full: {
        summary: 'Full — explicit number + date range (FDD Fig 2)',
        value: {
          name: 'Improved early-detection coverage',
          sort_order: 1,
          start_date: '2026-01-01',
          end_date: '2026-06-30',
        },
      },
    },
  })
  add(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Body() dto: CreateProgramOutcomeDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.outcomes.add(projectId, dto, user.id);
  }

  @Patch(':outcomeId')
  @ApiBody({
    type: UpdateProgramOutcomeDto,
    examples: {
      partial: {
        summary: 'Partial — send only what changes',
        value: { end_date: '2026-09-30' },
      },
    },
  })
  update(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('outcomeId', ParseUUIDPipe) outcomeId: string,
    @Body() dto: UpdateProgramOutcomeDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.outcomes.update(projectId, outcomeId, dto, user.id);
  }

  @Delete(':outcomeId')
  remove(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('outcomeId', ParseUUIDPipe) outcomeId: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.outcomes.remove(projectId, outcomeId, user.id);
  }
}
