import {
  Body, Controller, Delete, Param, ParseUUIDPipe, Patch, Post,
} from '@nestjs/common';
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
  add(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Body() dto: CreatePersonDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.people.add(projectId, dto, user.id);
  }

  @Patch(':memberId')
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