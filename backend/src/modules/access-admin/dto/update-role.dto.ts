import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';
import { APP_ROLES } from '../../../common/access/access.logic';

export class UpdateRoleDto {
  @ApiProperty({ enum: APP_ROLES, example: 'pmo' })
  @IsIn(APP_ROLES)
  app_role!: string;
}
