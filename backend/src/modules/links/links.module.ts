import { Module } from '@nestjs/common';
import { LinksController } from './links.controller';
import { LinksService } from './links.service';
import { LinksRepository } from './links.repository';

@Module({
  controllers: [LinksController],
  providers: [LinksService, LinksRepository],
  exports: [LinksService],
})
export class LinksModule {}
