import { Module } from '@nestjs/common';
import { RegistryController } from './registry.controller';
import { RegistryService } from './registry.service';
import { RegistryRepository } from './registry.repository';

@Module({
  controllers: [RegistryController],
  providers: [RegistryService, RegistryRepository],
})
export class RegistryModule {}
