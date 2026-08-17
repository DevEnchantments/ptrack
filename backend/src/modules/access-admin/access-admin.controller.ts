import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Put,
} from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { AccessAdminService } from './access-admin.service';
import { RequireCapability } from '../../common/access/access.decorators';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ReplaceGrantsDto } from './dto/replace-grants.dto';
import {
  CurrentUser,
  type AuthUser,
} from '../../common/decorators/current-user.decorator';

/**
 * Users & Roles administration. Whole surface needs users.manage_roles —
 * which admin always holds (hard-coded bypass), and can be granted to other
 * roles from the very grid this controller serves.
 */
@RequireCapability('users.manage_roles')
@Controller('access')
export class AccessAdminController {
  constructor(private readonly admin: AccessAdminService) {}

  @Get('users')
  users() {
    return this.admin.listUsers();
  }

  @Patch('users/:id/role')
  @ApiBody({
    type: UpdateRoleDto,
    examples: { promote: { value: { app_role: 'pmo' } } },
  })
  updateRole(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateRoleDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.admin.updateRole(id, dto.app_role, user.id);
  }

  @Get('capabilities')
  capabilities() {
    return this.admin.getGrants();
  }

  @Put('capabilities/:role')
  @ApiBody({
    type: ReplaceGrantsDto,
    examples: {
      pmo: { value: { capabilities: ['projects.create', 'cycles.close'] } },
    },
  })
  replaceGrants(
    @Param('role') role: string,
    @Body() dto: ReplaceGrantsDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.admin.replaceGrants(role, dto.capabilities, user.id);
  }
}
