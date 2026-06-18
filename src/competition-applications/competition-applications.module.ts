import { Module } from '@nestjs/common';
import { CompetitionApplicationsService } from './competition-applications.service.js';
import { CompetitionApplicationsController } from './competition-applications.controller.js';

@Module({
  controllers: [CompetitionApplicationsController],
  providers: [CompetitionApplicationsService],
})
export class CompetitionApplicationsModule {}
