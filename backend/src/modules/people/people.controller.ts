import {
  Body,
  Controller,
  Delete,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { PeopleService } from './people.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import {
  CurrentUser,
  type AuthUser,
} from '../../common/decorators/current-user.decorator';

@Controller('projects/:projectId/people')
export class PeopleController {
  constructor(private readonly people: PeopleService) {}

  @Post()
  @ApiBody({
    type: CreatePersonDto,
    examples: {
      pending: {
        summary: 'Pending person — replace role_id first',
        description:
          'role_id is required and must be a real ID from GET /lookups/project-roles. Use pending_name for someone with no user account.',
        value: {
          pending_name: 'Dana Whitfield',
          role_id: '00000000-0000-0000-0000-000000000000',
          access_level: 'read_write',
        },
      },
      existingUser: {
        summary: 'Existing user — replace both UUIDs first',
        description:
          'user_id from GET /users; role_id from GET /lookups/project-roles.',
        value: {
          user_id: '00000000-0000-0000-0000-000000000000',
          role_id: '00000000-0000-0000-0000-000000000000',
          access_level: 'read_write_admin',
          involvement_level_id: '00000000-0000-0000-0000-000000000000',
          notes: 'Joining for the cutover phase only.',
        },
      },
    },
  })
  add(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Body() dto: CreatePersonDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.people.add(projectId, dto, user.id);
  }

  @Patch(':memberId')
  @ApiBody({
    type: UpdatePersonDto,
    examples: {
      partial: {
        summary: 'Partial — send only what changes',
        value: { access_level: 'read_only' },
      },
    },
  })
  update(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('memberId', ParseUUIDPipe) memberId: string,
    @Body() dto: UpdatePersonDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.people.update(projectId, memberId, dto, user.id);
  }

  @Delete(':memberId')
  remove(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('memberId', ParseUUIDPipe) memberId: string,
  ) {
    return this.people.remove(projectId, memberId);
  }
}
