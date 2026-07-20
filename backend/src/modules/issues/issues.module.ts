import { Module } from '@nestjs/common';
import { IssuesController } from './issues.controller';
import { IssuesService } from './issues.service';
import { IssuesRepository } from './issues.repository';

@Module({
  controllers: [IssuesController],
  providers: [IssuesService, IssuesRepository],
  exports: [IssuesService],
})
export class IssuesModule {}
