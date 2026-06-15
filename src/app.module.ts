import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module.js';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { UsersModule } from './users/users.module.js';
import { LeaguesModule } from './leagues/leagues.module.js';
import { CivilizationsModule } from './civilizations/civilizations.module.js';
import { SeriesModule } from './series/series.module.js';
import { MatchesModule } from './matches/matches.module.js';
import { PlayerCivilizationsModule } from './player-civilizations/player-civilizations.module.js';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    LeaguesModule,
    CivilizationsModule,
    SeriesModule,
    MatchesModule,
    PlayerCivilizationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
