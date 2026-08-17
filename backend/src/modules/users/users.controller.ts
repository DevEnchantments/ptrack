import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { ProvisionUserDto } from './dto/provision-user.dto';
import {
  CurrentUser,
  type AuthUser,
} from '../../common/decorators/current-user.decorator';
import { AdminOnly } from '../../common/access/access.decorators';
import { AppRoleService } from '../../common/access/app-role.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly users: UsersService,
    private readonly roles: AppRoleService,
  ) {}

  @Get()
  search(@Query('search') search?: string) {
    return this.users.search(search);
  }

  /** Who am I + my global role — the frontend gates its affordances on this. */
  @Get('me')
  async me(@CurrentUser() user: AuthUser) {
    return {
      id: user.id,
      email: user.email,
      app_role: await this.roles.getRole(user.id),
    };
  }

  @AdminOnly()
  @Post('provision')
  @ApiBody({
    type: ProvisionUserDto,
    examples: {
      minimal: {
        summary: 'Create an account and claim pending memberships',
        value: {
          email: 'sara.alharbi@poc.ptrack.local',
          full_name: 'Sara Al-Harbi',
          password: 'Temp-9f3kQ2vx',
        },
      },
    },
  })
  provision(@Body() dto: ProvisionUserDto, @CurrentUser() user: AuthUser) {
    return this.users.provision(dto, user.id);
  }

  @AdminOnly()
  @Post('claim')
  claim(@CurrentUser() user: AuthUser) {
    return this.users.claimForCurrentUser(user);
  }
}
