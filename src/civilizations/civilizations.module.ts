import { Module } from '@nestjs/common';
import { CivilizationsService } from './civilizations.service.js';
import { CivilizationsController } from './civilizations.controller.js';

@Module({
  controllers: [CivilizationsController],
  providers: [CivilizationsService],
})
export class CivilizationsModule {}
