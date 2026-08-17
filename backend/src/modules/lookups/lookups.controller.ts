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
import { RequireCapability } from '../../common/access/access.decorators';

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

  @RequireCapability('lookups.manage')
  @Post(':name/values')
  addValue(@Param('name') name: string, @Body() dto: CreateLookupValueDto) {
    return this.lookups.addValue(name, dto);
  }

  @RequireCapability('lookups.manage')
  @Patch(':name/values/:id')
  updateValue(
    @Param('name') name: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateLookupValueDto,
  ) {
    return this.lookups.updateValue(name, id, dto);
  }

  @RequireCapability('lookups.manage')
  @Post('project-categories')
  createCategory(@Body('name') name: string) {
    return this.lookups.createCategory(name);
  }

  @RequireCapability('lookups.manage')
  @Post('sectors')
  createSector(@Body('name') name: string) {
    return this.lookups.createSector(name);
  }

  @RequireCapability('lookups.manage')
  @Post('project-roles')
  createRole(
    @Body('name') name: string,
    @Body('default_access_level') defaultAccessLevel: string,
  ) {
    return this.lookups.createRole(name, defaultAccessLevel);
  }
}
