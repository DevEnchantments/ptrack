import {
  Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post,
} from '@nestjs/common';
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
  add(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Body() dto: CreateIssueDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.issues.add(projectId, dto, user.id);
  }

  @Patch(':issueId')
  update(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('issueId', ParseUUIDPipe) issueId: string,
    @Body() dto: UpdateIssueDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.issues.update(projectId, issueId, dto, user.id);
  }
}