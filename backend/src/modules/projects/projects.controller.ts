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
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import {
  CurrentUser,
  type AuthUser,
} from '../../common/decorators/current-user.decorator';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projects: ProjectsService) {}

  @Post()
  @ApiBody({
    type: CreateProjectDto,
    examples: {
      minimal: {
        summary: 'Minimal — runs as-is',
        description: 'name is the only required field.',
        value: { name: 'Apollo Data Migration' },
      },
      full: {
        summary: 'Full — replace the UUIDs first',
        description:
          'The *_id values below are placeholders. Fetch real ones from GET /lookups/project-statuses, /project-categories, /project-sizes and /project-roles.',
        value: {
          name: 'Apollo Data Migration',
          start_date: '2026-07-13',
          access_control: 'open',
          status_id: '00000000-0000-0000-0000-000000000000',
          category_id: '00000000-0000-0000-0000-000000000000',
          size_id: '00000000-0000-0000-0000-000000000000',
          description:
            'Migrate the legacy Apollo dataset onto the new platform.',
          goal: 'Zero-downtime cutover by end of Q3.',
          customer: 'Finance Division',
          tags: ['migration', 'q3'],
          primary_url: 'https://intranet.example.com/apollo',
          members: [
            {
              pending_name: 'Dana Whitfield',
              role_id: '00000000-0000-0000-0000-000000000000',
            },
          ],
        },
      },
    },
  })
  create(@Body() dto: CreateProjectDto, @CurrentUser() user: AuthUser) {
    return this.projects.create(dto, user.id);
  }

  @Get()
  findAll() {
    return this.projects.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.projects.getDetail(id);
  }

  @Patch(':id')
  @ApiBody({
    type: UpdateProjectDto,
    examples: {
      partial: {
        summary: 'Partial — send only what changes',
        value: {
          name: 'Apollo Data Migration (Phase 2)',
          customer: 'Finance Division',
        },
      },
    },
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateProjectDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.projects.update(id, dto, user.id);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.projects.remove(id);
  }
}
