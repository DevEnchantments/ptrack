import { Module } from '@nestjs/common';
import { AccessAdminController } from './access-admin.controller';
import { AccessAdminService } from './access-admin.service';
import { AccessAdminRepository } from './access-admin.repository';

@Module({
  controllers: [AccessAdminController],
  providers: [AccessAdminService, AccessAdminRepository],
})
export class AccessAdminModule {}
