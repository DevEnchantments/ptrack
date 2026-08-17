import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { TemplatesService } from './templates.service';
import { CreateTemplateDto, InstantiateTemplateDto } from './dto/templates.dto';
import {
  CurrentUser,
  type AuthUser,
} from '../../common/decorators/current-user.decorator';
import { RequireCapability } from '../../common/access/access.decorators';

@Controller('templates')
export class TemplatesController {
  constructor(private readonly templates: TemplatesService) {}

  @Get()
  list() {
    return this.templates.list();
  }

  @Post()
  @ApiBody({
    type: CreateTemplateDto,
    examples: {
      minimal: {
        summary: 'Snapshot a project (fetch a real id from GET /projects)',
        value: {
          name: 'Standard screening program',
          project_id: 'dd000000-0000-4000-a000-000000001001',
        },
      },
    },
  })
  create(@Body() dto: CreateTemplateDto, @CurrentUser() user: AuthUser) {
    return this.templates.createFromProject(
      dto.name,
      dto.description ?? null,
      dto.project_id,
      user.id,
    );
  }

  @Delete(':templateId')
  remove(@Param('templateId', ParseUUIDPipe) templateId: string) {
    return this.templates.remove(templateId);
  }

  @RequireCapability('templates.instantiate')
  @Post(':templateId/instantiate')
  @ApiBody({
    type: InstantiateTemplateDto,
    examples: {
      minimal: {
        summary: 'New project from the template',
        value: { name: 'Regional Screening 2027', start_date: '2027-01-01' },
      },
    },
  })
  instantiate(
    @Param('templateId', ParseUUIDPipe) templateId: string,
    @Body() dto: InstantiateTemplateDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.templates.instantiate(templateId, dto, user.id);
  }
}
