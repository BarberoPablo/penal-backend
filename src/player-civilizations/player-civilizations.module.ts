import { Module } from '@nestjs/common';
import { PlayerCivilizationsService } from './player-civilizations.service.js';

@Module({
  controllers: [],
  providers: [PlayerCivilizationsService],
})
export class PlayerCivilizationsModule {}
