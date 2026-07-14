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
  @ApiBody({
    type: CreateLinkDto,
    examples: {
      minimal: {
        summary: 'Minimal — runs as-is',
        value: { url: 'https://intranet.example.com/apollo/runbook' },
      },
      full: {
        summary: 'Full — runs as-is (no UUIDs needed)',
        value: {
          url: 'https://intranet.example.com/apollo/runbook',
          label: 'Cutover runbook',
          description: 'Step-by-step cutover procedure.',
          is_gold: true,
          tags: ['runbook'],
        },
      },
    },
  })
  add(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Body() dto: CreateLinkDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.links.add(projectId, dto, user.id);
  }

  @Patch(':linkId')
  @ApiBody({
    type: UpdateLinkDto,
    examples: {
      partial: {
        summary: 'Partial — send only what changes',
        value: { label: 'Cutover runbook (v3)', is_gold: true },
      },
    },
  })
  update(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('linkId', ParseUUIDPipe) linkId: string,
    @Body() dto: UpdateLinkDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.links.update(projectId, linkId, dto, user.id);
  }

  @Delete(':linkId')
  remove(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('linkId', ParseUUIDPipe) linkId: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.links.remove(projectId, linkId, user.id);
  }
}
