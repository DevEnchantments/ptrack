import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { LookupsService } from './lookups.service';
import {
  CreateLookupValueDto,
  UpdateLookupValueDto,
} from './dto/lookup-value.dto';
import { AdminOnly } from '../../common/access/access.decorators';

@Controller('lookups')
export class LookupsController {
  constructor(private readonly lookups: LookupsService) {}

  /** Admin: every code table with all rows, inactive included. */
  @Get()
  adminList() {
    return this.lookups.adminList();
  }

  @Get(':name')
  list(@Param('name') name: string) {
    return this.lookups.list(name);
  }

  @AdminOnly()
  @Post(':name/values')
  addValue(@Param('name') name: string, @Body() dto: CreateLookupValueDto) {
    return this.lookups.addValue(name, dto);
  }

  @AdminOnly()
  @Patch(':name/values/:id')
  updateValue(
    @Param('name') name: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateLookupValueDto,
  ) {
    return this.lookups.updateValue(name, id, dto);
  }

  @AdminOnly()
  @Post('project-categories')
  createCategory(@Body('name') name: string) {
    return this.lookups.createCategory(name);
  }

  @AdminOnly()
  @Post('sectors')
  createSector(@Body('name') name: string) {
    return this.lookups.createSector(name);
  }

  @AdminOnly()
  @Post('project-roles')
  createRole(
    @Body('name') name: string,
    @Body('default_access_level') defaultAccessLevel: string,
  ) {
    return this.lookups.createRole(name, defaultAccessLevel);
  }
}
