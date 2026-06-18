import { PrismaService } from '../prisma/prisma.service.js';

export class CompetitionApplicationsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findPendingByUser(competitionId: string, userId: number) {
    return this.prisma.competitionApplication.findUnique({
      where: {
        competitionId_userId: { competitionId, userId },
      },
      include: {
        applicationCivilizations: {
          include: { civilization: true },
        },
      },
    });
  }

  async create(
    competitionId: string,
    userId: number,
    civIds: string[],
  ) {
    return this.prisma.competitionApplication.create({
      data: {
        competitionId,
        userId,
        status: 'PENDING',
        applicationCivilizations: {
          create: civIds.map((civId) => ({ civId })),
        },
      },
      include: {
        applicationCivilizations: {
          include: { civilization: true },
        },
      },
    });
  }

  async findByCompetition(competitionId: string) {
    return this.prisma.competitionApplication.findMany({
      where: { competitionId },
      include: {
        user: true,
        applicationCivilizations: {
          include: { civilization: true },
        },
      },
      orderBy: { submittedAt: 'desc' },
    });
  }
}
