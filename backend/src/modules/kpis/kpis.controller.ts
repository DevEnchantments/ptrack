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
import { KpisService } from './kpis.service';
import { CreateKpiDto } from './dto/create-kpi.dto';
import {
  CreateKpiActionPlanDto,
  CreateKpiReadingDto,
  UpdateKpiActionPlanDto,
  UpdateKpiDto,
} from './dto/kpi-children.dto';
import {
  CurrentUser,
  type AuthUser,
} from '../../common/decorators/current-user.decorator';
import { RequireCapability } from '../../common/access/access.decorators';

@Controller('kpis')
export class KpisController {
  constructor(private readonly kpis: KpisService) {}

  @Get()
  list() {
    return this.kpis.list();
  }

  @RequireCapability('kpis.manage')
  @Post()
  @ApiBody({
    type: CreateKpiDto,
    examples: {
      minimal: {
        summary: 'Minimal — runs as-is',
        value: { name: 'Screening coverage rate' },
      },
    },
  })
  add(@Body() dto: CreateKpiDto, @CurrentUser() user: AuthUser) {
    return this.kpis.add(dto, user.id);
  }

  @RequireCapability('kpis.manage')
  @Patch(':kpiId')
  update(
    @Param('kpiId', ParseUUIDPipe) kpiId: string,
    @Body() dto: UpdateKpiDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.kpis.update(kpiId, dto, user.id);
  }

  @RequireCapability('kpis.manage')
  @Delete(':kpiId')
  remove(@Param('kpiId', ParseUUIDPipe) kpiId: string) {
    return this.kpis.remove(kpiId);
  }

  @RequireCapability('kpis.manage')
  @Post(':kpiId/readings')
  addReading(
    @Param('kpiId', ParseUUIDPipe) kpiId: string,
    @Body() dto: CreateKpiReadingDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.kpis.addReading(kpiId, dto, user.id);
  }

  @RequireCapability('kpis.manage')
  @Delete(':kpiId/readings/:readingId')
  removeReading(
    @Param('kpiId', ParseUUIDPipe) kpiId: string,
    @Param('readingId', ParseUUIDPipe) readingId: string,
  ) {
    return this.kpis.removeReading(kpiId, readingId);
  }

  @RequireCapability('kpis.manage')
  @Post(':kpiId/plans')
  addPlan(
    @Param('kpiId', ParseUUIDPipe) kpiId: string,
    @Body() dto: CreateKpiActionPlanDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.kpis.addPlan(kpiId, dto, user.id);
  }

  @RequireCapability('kpis.manage')
  @Patch(':kpiId/plans/:planId')
  updatePlan(
    @Param('kpiId', ParseUUIDPipe) kpiId: string,
    @Param('planId', ParseUUIDPipe) planId: string,
    @Body() dto: UpdateKpiActionPlanDto,
  ) {
    return this.kpis.updatePlan(kpiId, planId, dto);
  }

  @RequireCapability('kpis.manage')
  @Delete(':kpiId/plans/:planId')
  removePlan(
    @Param('kpiId', ParseUUIDPipe) kpiId: string,
    @Param('planId', ParseUUIDPipe) planId: string,
  ) {
    return this.kpis.removePlan(kpiId, planId);
  }
}
