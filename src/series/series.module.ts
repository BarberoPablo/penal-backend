import { Module } from '@nestjs/common';
import { SeriesService } from './series.service.js';

@Module({
  controllers: [],
  providers: [SeriesService],
})
export class SeriesModule {}
