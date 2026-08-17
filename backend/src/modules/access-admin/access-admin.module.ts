import { Module } from '@nestjs/common';
import { AccessAdminController } from './access-admin.controller';
import { AccessAdminService } from './access-admin.service';

@Module({
  controllers: [AccessAdminController],
  providers: [AccessAdminService],
})
export class AccessAdminModule {}
