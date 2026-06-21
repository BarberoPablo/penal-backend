import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { CompetitionAdminGuard } from '../auth/guards/competition-admin.guard.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CompetitionApplicationsController } from './competition-applications.controller.js';
import { CompetitionApplicationsService } from './competition-applications.service.js';

@Module({
  imports: [PrismaModule],
  controllers: [CompetitionApplicationsController],
  providers: [
    CompetitionApplicationsService,
    {
      provide: APP_GUARD,
      useClass: CompetitionAdminGuard,
    },
    PrismaService,
  ],
})
export class CompetitionApplicationsModule {}
