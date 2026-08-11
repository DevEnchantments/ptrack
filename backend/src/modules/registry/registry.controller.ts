import { Controller, Get } from '@nestjs/common';
import { RegistryService } from './registry.service';

/** Cross-project registers behind the global sidebar pages. */
@Controller()
export class RegistryController {
  constructor(private readonly registry: RegistryService) {}

  @Get('milestones')
  milestones() {
    return this.registry.milestones();
  }

  @Get('action-items')
  actionItems() {
    return this.registry.actionItems();
  }

  @Get('people')
  people() {
    return this.registry.people();
  }
}
