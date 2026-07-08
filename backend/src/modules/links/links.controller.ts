import {
  Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post,
} from '@nestjs/common';
import { LinksService } from './links.service';
import { CreateLinkDto } from './dto/create-link.dto';
import { UpdateLinkDto } from './dto/update-link.dto';
import {
  CurrentUser,
  type AuthUser,
} from '../../common/decorators/current-user.decorator';

@Controller('projects/:projectId/links')
export class LinksController {
  constructor(private readonly links: LinksService) {}

  @Get()
  list(@Param('projectId', ParseUUIDPipe) projectId: string) {
    return this.links.list(projectId);
  }

  @Post()
  add(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Body() dto: CreateLinkDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.links.add(projectId, dto, user.id);
  }

  @Patch(':linkId')
  update(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('linkId', ParseUUIDPipe) linkId: string,
    @Body() dto: UpdateLinkDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.links.update(projectId, linkId, dto, user.id);
  }
}