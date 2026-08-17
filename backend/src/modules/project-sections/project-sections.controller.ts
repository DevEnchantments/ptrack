import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProjectSectionsService } from './project-sections.service';
import { ProjectScoped } from '../../common/access/access.decorators';

/**
 * Same URL as before the extraction — `GET /projects/:id/sections` — only the
 * class serving it moved. Auth comes from the global APP_GUARD, as it does for
 * every other controller.
 *
 * Swagger groups by controller class, so the explicit tag keeps this route
 * under "Projects" in /api/docs where it has always been.
 */
@ApiTags('Projects')
@ProjectScoped('id')
@Controller('projects')
export class ProjectSectionsController {
  constructor(private readonly sections: ProjectSectionsService) {}

  @Get(':id/sections')
  list(@Param('id', ParseUUIDPipe) id: string) {
    return this.sections.list(id);
  }
}
