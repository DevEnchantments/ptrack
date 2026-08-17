import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { SubmissionsService } from './submissions.service';
import { SubmissionActionDto } from './dto/submission-action.dto';
import {
  CurrentUser,
  type AuthUser,
} from '../../common/decorators/current-user.decorator';
import {
  MinAppRole,
  ProjectScoped,
} from '../../common/access/access.decorators';

const ACTION_BODY = {
  type: SubmissionActionDto,
  examples: {
    withComment: {
      summary: 'Optional comment',
      value: { comment: 'August figures updated; two milestones closed.' },
    },
  },
};

@Controller('reports')
export class ReportsController {
  constructor(private readonly submissions: SubmissionsService) {}

  @Get('cycle-status')
  cycleStatus(@CurrentUser() user: AuthUser) {
    return this.submissions.cycleStatus(user.id);
  }
}

/** FR-14 closure: lock/unlock the current month's reporting cycle. */
@Controller('cycles')
export class CyclesController {
  constructor(private readonly submissions: SubmissionsService) {}

  @Get('current')
  current() {
    return this.submissions.currentCycle();
  }

  @MinAppRole('pmo')
  @Post('current/close')
  close() {
    return this.submissions.closeCurrentCycle();
  }

  @MinAppRole('pmo')
  @Post('current/reopen')
  reopen() {
    return this.submissions.reopenCurrentCycle();
  }
}

@ProjectScoped()
@Controller('projects/:projectId/submissions')
export class SubmissionsController {
  constructor(private readonly submissions: SubmissionsService) {}

  @Get()
  list(@Param('projectId', ParseUUIDPipe) projectId: string) {
    return this.submissions.list(projectId);
  }

  @Post('submit')
  @ApiBody(ACTION_BODY)
  submit(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Body() dto: SubmissionActionDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.submissions.submit(projectId, dto, user.id);
  }

  @Post(':submissionId/validate')
  @ApiBody(ACTION_BODY)
  validate(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('submissionId', ParseUUIDPipe) submissionId: string,
    @Body() dto: SubmissionActionDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.submissions.validate(projectId, submissionId, dto, user.id);
  }

  @Post(':submissionId/approve')
  @ApiBody(ACTION_BODY)
  approve(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('submissionId', ParseUUIDPipe) submissionId: string,
    @Body() dto: SubmissionActionDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.submissions.approve(projectId, submissionId, dto, user.id);
  }

  @Post(':submissionId/return')
  @ApiBody(ACTION_BODY)
  returnSubmission(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('submissionId', ParseUUIDPipe) submissionId: string,
    @Body() dto: SubmissionActionDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.submissions.returnSubmission(
      projectId,
      submissionId,
      dto,
      user.id,
    );
  }

  @Post(':submissionId/reject')
  @ApiBody(ACTION_BODY)
  reject(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('submissionId', ParseUUIDPipe) submissionId: string,
    @Body() dto: SubmissionActionDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.submissions.reject(projectId, submissionId, dto, user.id);
  }
}
