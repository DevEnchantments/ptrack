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
import { RisksService } from './risks.service';
import { CreateRiskDto } from './dto/create-risk.dto';
import { UpdateRiskDto } from './dto/update-risk.dto';
import {
  CurrentUser,
  type AuthUser,
} from '../../common/decorators/current-user.decorator';
import {
  ProjectAccess,
  ProjectScoped,
} from '../../common/access/access.decorators';
import { AccessLevel } from '../../common/access/access.logic';

@ProjectScoped()
@Controller('projects/:projectId/risks')
export class RisksController {
  constructor(private readonly risks: RisksService) {}

  @Get()
  list(@Param('projectId', ParseUUIDPipe) projectId: string) {
    return this.risks.list(projectId);
  }

  @Post()
  @ApiBody({
    type: CreateRiskDto,
    examples: {
      minimal: {
        summary: 'Minimal — runs as-is',
        value: {
          statement: 'Vendor SSO integration may slip past the pilot date',
        },
      },
      full: {
        summary: 'Full — replace the UUIDs first',
        description:
          'probability_id from GET /lookups/risk-probability-levels; impact_id from /lookups/risk-impact-levels; response_id from /lookups/risk-responses; source_id from /lookups/risk-sources; category_id from /lookups/risk-categories; owner_id from GET /users.',
        value: {
          statement: 'Vendor SSO integration may slip past the pilot date',
          identified_by: 'Amna Khalid',
          date_identified: '2026-07-30',
          source_id: '00000000-0000-0000-0000-000000000000',
          category_id: '00000000-0000-0000-0000-000000000000',
          owner_id: '00000000-0000-0000-0000-000000000000',
          probability_id: '00000000-0000-0000-0000-000000000000',
          impact_id: '00000000-0000-0000-0000-000000000000',
          response_id: '00000000-0000-0000-0000-000000000000',
          response_plan:
            'Weekly integration checkpoint with the vendor from August.',
          priority: 'High',
          action: 'Escalate to the PMO partner if the August checkpoint slips.',
          status: 'open',
          type: 'risk',
        },
      },
    },
  })
  add(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Body() dto: CreateRiskDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.risks.add(projectId, dto, user.id);
  }

  // View-level on purpose: the service allows the risk's own owner to
  // update it (FDD role 4) even without project write access.
  @ProjectAccess(AccessLevel.View)
  @Patch(':riskId')
  @ApiBody({
    type: UpdateRiskDto,
    examples: {
      partial: {
        summary: 'Partial — send only what changes',
        value: { status: 'closed' },
      },
    },
  })
  update(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('riskId', ParseUUIDPipe) riskId: string,
    @Body() dto: UpdateRiskDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.risks.update(projectId, riskId, dto, user.id);
  }

  @Delete(':riskId')
  remove(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('riskId', ParseUUIDPipe) riskId: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.risks.remove(projectId, riskId, user.id);
  }
}
