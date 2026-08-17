import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { ImportService } from './import.service';
import { ImportRowsDto } from './dto/import-rows.dto';
import {
  CurrentUser,
  type AuthUser,
} from '../../common/decorators/current-user.decorator';
import { AdminOnly } from '../../common/access/access.decorators';

// CSV import writes across projects wholesale — FDD role 1 territory.
@AdminOnly()
@Controller('import')
export class ImportController {
  constructor(private readonly imports: ImportService) {}

  @Post('projects')
  @ApiBody({
    type: ImportRowsDto,
    examples: {
      minimal: {
        summary: 'Two projects — runs as-is',
        value: {
          rows: [
            {
              name: 'Imported Project A',
              status: 'In Progress',
              plan_year: '2026',
            },
            { name: 'Imported Project B', start_date: '2026-09-01' },
          ],
        },
      },
    },
  })
  importProjects(@Body() dto: ImportRowsDto, @CurrentUser() user: AuthUser) {
    return this.imports.importProjects(dto.rows, user.id);
  }

  @Post('milestones')
  @ApiBody({
    type: ImportRowsDto,
    examples: {
      minimal: {
        summary: 'One milestone — project matched by name',
        value: {
          rows: [
            {
              project: 'Imported Project A',
              name: 'Kickoff complete',
              due_date: '2026-10-01',
              weightage: '25',
            },
          ],
        },
      },
    },
  })
  importMilestones(@Body() dto: ImportRowsDto, @CurrentUser() user: AuthUser) {
    return this.imports.importMilestones(dto.rows, user.id);
  }
}
