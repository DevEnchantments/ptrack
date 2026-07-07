import { Body, Controller, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { PeopleService } from './people.service';
import { CreatePersonDto } from './dto/create-person.dto';
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
}