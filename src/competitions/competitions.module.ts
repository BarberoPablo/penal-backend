import { Module } from '@nestjs/common';
import { CompetitionsService } from './competitions.service.js';
import { CompetitionsController } from './competitions.controller.js';

@Module({
  controllers: [CompetitionsController],
  providers: [CompetitionsService],
})
export class CompetitionsModule {}
