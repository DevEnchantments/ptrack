import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { LookupsService } from './lookups.service';

@Controller('lookups')
export class LookupsController {
  constructor(private readonly lookups: LookupsService) {}

  @Get(':name')
  list(@Param('name') name: string) {
    return this.lookups.list(name);
  }

  @Post('project-categories')
  createCategory(@Body('name') name: string) {
    return this.lookups.createCategory(name);
  }

  @Post('project-roles')
  createRole(
    @Body('name') name: string,
    @Body('default_access_level') defaultAccessLevel: string,
  ) {
    return this.lookups.createRole(name, defaultAccessLevel);
  }
}
