import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { ProvisionUserDto } from './dto/provision-user.dto';
import {
  CurrentUser,
  type AuthUser,
} from '../../common/decorators/current-user.decorator';
import { RequireCapability } from '../../common/access/access.decorators';
import { AppRoleService } from '../../common/access/app-role.service';
import { CapabilityService } from '../../common/access/capability.service';
import {
  CAPABILITY_KEYS,
  GRANTABLE_ROLES,
} from '../../common/access/access.logic';

@Controller('users')
export class UsersController {
  constructor(
    private readonly users: UsersService,
    private readonly roles: AppRoleService,
    private readonly capabilities: CapabilityService,
  ) {}

  @Get()
  search(@Query('search') search?: string) {
    return this.users.search(search);
  }

  /**
   * Who am I, my global role, and my capability set — the frontend gates its
   * affordances on this (the backend still enforces every one of them).
   */
  @Get('me')
  async me(@CurrentUser() user: AuthUser) {
    const role = await this.roles.getRole(user.id);
    const capabilities =
      role === 'admin'
        ? [...CAPABILITY_KEYS]
        : GRANTABLE_ROLES.includes(role)
          ? [...(await this.capabilities.grants())[role]]
          : [];
    return { id: user.id, email: user.email, app_role: role, capabilities };
  }

  @RequireCapability('users.provision')
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

  @RequireCapability('users.provision')
  @Post('claim')
  claim(@CurrentUser() user: AuthUser) {
    return this.users.claimForCurrentUser(user);
  }
}
