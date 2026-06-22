import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { CompetitionAdminGuard } from '../auth/guards/competition-admin.guard.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CompetitionParticipantsController } from './competition-participants.controller.js';
import { CompetitionParticipantsService } from './competition-participants.service.js';

@Module({
  imports: [PrismaModule],
  controllers: [CompetitionParticipantsController],
  providers: [
    CompetitionParticipantsService,
    {
      provide: APP_GUARD,
      useClass: CompetitionAdminGuard,
    },
    PrismaService,
  ],
})
export class CompetitionParticipantsModule {}
