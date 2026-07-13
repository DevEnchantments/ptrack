import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { ResourcesService } from './resources.service';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import {
  CurrentUser,
  type AuthUser,
} from '../../common/decorators/current-user.decorator';

@Controller('projects/:projectId/resources')
export class ResourcesController {
  constructor(private readonly resources: ResourcesService) {}

  @Get()
  list(@Param('projectId', ParseUUIDPipe) projectId: string) {
    return this.resources.list(projectId);
  }

  @Post()
  @ApiBody({
    type: CreateResourceDto,
    examples: {
      minimal: {
        summary: 'Minimal — replace type_id first',
        description:
          'type_id is required and must be a real ID from GET /lookups/resource-types.',
        value: {
          name: 'Staging database cluster',
          type_id: '00000000-0000-0000-0000-000000000000',
        },
      },
      full: {
        summary: 'Full — replace type_id first',
        value: {
          name: 'Staging database cluster',
          type_id: '00000000-0000-0000-0000-000000000000',
          description: 'Reserved for the migration dry runs.',
        },
      },
    },
  })
  add(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Body() dto: CreateResourceDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.resources.add(projectId, dto, user.id);
  }

  @Patch(':resourceId')
  @ApiBody({
    type: UpdateResourceDto,
    examples: {
      partial: {
        summary: 'Partial — send only what changes',
        value: { description: 'Released back to the shared pool.' },
      },
    },
  })
  update(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('resourceId', ParseUUIDPipe) resourceId: string,
    @Body() dto: UpdateResourceDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.resources.update(projectId, resourceId, dto, user.id);
  }
}
