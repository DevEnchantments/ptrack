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
import { IssuesService } from './issues.service';
import { CreateIssueDto } from './dto/create-issue.dto';
import { UpdateIssueDto } from './dto/update-issue.dto';
import {
  CurrentUser,
  type AuthUser,
} from '../../common/decorators/current-user.decorator';

@Controller('projects/:projectId/issues')
export class IssuesController {
  constructor(private readonly issues: IssuesService) {}

  @Get()
  list(@Param('projectId', ParseUUIDPipe) projectId: string) {
    return this.issues.list(projectId);
  }

  @Post()
  @ApiBody({
    type: CreateIssueDto,
    examples: {
      minimal: {
        summary: 'Minimal — runs as-is',
        value: { title: 'Legacy rows fail the checksum validation' },
      },
      full: {
        summary: 'Full — replace the UUIDs first',
        description:
          'level_id from GET /lookups/issue-levels; category_id from /lookups/issue-categories; role_id from /lookups/project-roles; owner_id from GET /users.',
        value: {
          title: 'Legacy rows fail the checksum validation',
          status: 'open',
          role_id: '00000000-0000-0000-0000-000000000000',
          owner_id: '00000000-0000-0000-0000-000000000000',
          level_id: '00000000-0000-0000-0000-000000000000',
          category_id: '00000000-0000-0000-0000-000000000000',
          description:
            'Roughly 400 rows in the 2019 partition fail validation.',
          url: 'https://intranet.example.com/tickets/4821',
          tags: ['data-quality'],
        },
      },
    },
  })
  add(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Body() dto: CreateIssueDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.issues.add(projectId, dto, user.id);
  }

  @Patch(':issueId')
  @ApiBody({
    type: UpdateIssueDto,
    examples: {
      partial: {
        summary: 'Partial — send only what changes',
        value: {
          status: 'closed',
          resolution: 'Re-ran the import with the corrected mapping.',
        },
      },
    },
  })
  update(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('issueId', ParseUUIDPipe) issueId: string,
    @Body() dto: UpdateIssueDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.issues.update(projectId, issueId, dto, user.id);
  }

  @Delete(':issueId')
  remove(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('issueId', ParseUUIDPipe) issueId: string,
  ) {
    return this.issues.remove(projectId, issueId);
  }
}
