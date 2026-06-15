import { Module } from '@nestjs/common';
import { PlayerCivilizationsService } from './player-civilizations.service.js';
import { PlayerCivilizationsController } from './player-civilizations.controller.js';

@Module({
  controllers: [PlayerCivilizationsController],
  providers: [PlayerCivilizationsService],
})
export class PlayerCivilizationsModule {}
