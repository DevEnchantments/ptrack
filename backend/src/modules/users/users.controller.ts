import { Body, Controller, Get, Patch, Post, Query } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { ProvisionUserDto } from './dto/provision-user.dto';
import { UpdateMeDto } from './dto/update-me.dto';
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
    const [role, profile] = await Promise.all([
      this.roles.getRole(user.id),
      this.users.myProfile(user.id),
    ]);
    const capabilities =
      role === 'admin'
        ? [...CAPABILITY_KEYS]
        : GRANTABLE_ROLES.includes(role)
          ? [...(await this.capabilities.grants())[role]]
          : [];
    return {
      id: user.id,
      email: user.email,
      full_name: profile.full_name,
      app_role: role,
      capabilities,
    };
  }

  @Get('me/memberships')
  myMemberships(@CurrentUser() user: AuthUser) {
    return this.users.myMemberships(user.id);
  }

  @Get('me/work')
  myWork(@CurrentUser() user: AuthUser) {
    return this.users.myWork(user.id);
  }

  /** Anyone may rename themselves — it only changes their own profile row. */
  @Patch('me')
  updateMe(@Body() dto: UpdateMeDto, @CurrentUser() user: AuthUser) {
    return this.users.updateMe(user.id, dto.full_name);
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
