import { Controller, Get } from '@nestjs/common';
import { RegistryService } from './registry.service';
import {
  CurrentUser,
  type AuthUser,
} from '../../common/decorators/current-user.decorator';

/** Cross-project registers behind the global sidebar pages. */
@Controller()
export class RegistryController {
  constructor(private readonly registry: RegistryService) {}

  @Get('milestones')
  milestones(@CurrentUser() user: AuthUser) {
    return this.registry.milestones(user.id);
  }

  @Get('action-items')
  actionItems(@CurrentUser() user: AuthUser) {
    return this.registry.actionItems(user.id);
  }

  @Get('people')
  people(@CurrentUser() user: AuthUser) {
    return this.registry.people(user.id);
  }
}
