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
import { MinAppRole } from '../../common/access/access.decorators';

@Controller('kpis')
export class KpisController {
  constructor(private readonly kpis: KpisService) {}

  @Get()
  list() {
    return this.kpis.list();
  }

  @MinAppRole('pmo')
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

  @MinAppRole('pmo')
  @Patch(':kpiId')
  update(
    @Param('kpiId', ParseUUIDPipe) kpiId: string,
    @Body() dto: UpdateKpiDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.kpis.update(kpiId, dto, user.id);
  }

  @MinAppRole('pmo')
  @Delete(':kpiId')
  remove(@Param('kpiId', ParseUUIDPipe) kpiId: string) {
    return this.kpis.remove(kpiId);
  }

  @MinAppRole('pmo')
  @Post(':kpiId/readings')
  addReading(
    @Param('kpiId', ParseUUIDPipe) kpiId: string,
    @Body() dto: CreateKpiReadingDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.kpis.addReading(kpiId, dto, user.id);
  }

  @MinAppRole('pmo')
  @Delete(':kpiId/readings/:readingId')
  removeReading(
    @Param('kpiId', ParseUUIDPipe) kpiId: string,
    @Param('readingId', ParseUUIDPipe) readingId: string,
  ) {
    return this.kpis.removeReading(kpiId, readingId);
  }

  @MinAppRole('pmo')
  @Post(':kpiId/plans')
  addPlan(
    @Param('kpiId', ParseUUIDPipe) kpiId: string,
    @Body() dto: CreateKpiActionPlanDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.kpis.addPlan(kpiId, dto, user.id);
  }

  @MinAppRole('pmo')
  @Patch(':kpiId/plans/:planId')
  updatePlan(
    @Param('kpiId', ParseUUIDPipe) kpiId: string,
    @Param('planId', ParseUUIDPipe) planId: string,
    @Body() dto: UpdateKpiActionPlanDto,
  ) {
    return this.kpis.updatePlan(kpiId, planId, dto);
  }

  @MinAppRole('pmo')
  @Delete(':kpiId/plans/:planId')
  removePlan(
    @Param('kpiId', ParseUUIDPipe) kpiId: string,
    @Param('planId', ParseUUIDPipe) planId: string,
  ) {
    return this.kpis.removePlan(kpiId, planId);
  }
}
