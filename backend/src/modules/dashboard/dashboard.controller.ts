import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import {
  CurrentUser,
  type AuthUser,
} from '../../common/decorators/current-user.decorator';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboard: DashboardService) {}

  @Get()
  data(@CurrentUser() user: AuthUser) {
    return this.dashboard.data(user.id);
  }
}
