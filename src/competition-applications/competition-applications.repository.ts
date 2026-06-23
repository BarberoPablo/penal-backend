import { PrismaService } from '../prisma/prisma.service.js';

export class CompetitionApplicationsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: number) {
    return this.prisma.competitionApplication.findUnique({
      where: { id },
      include: {
        applicationCivilizations: {
          include: { civilization: true },
        },
        user: true,
      },
    });
  }

  async findByUser(competitionId: string, userId: number) {
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

  async create(competitionId: string, userId: number, civIds: string[]) {
    return this.prisma.competitionApplication.create({
      data: {
        competitionId,
        userId,
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

  async getCivilizationsByIds(ids: string[]) {
    return this.prisma.civilization.findMany({
      where: { id: { in: ids } },
      select: { id: true, cost: true },
    });
  }

  async accept(
    applicationId: number,
    userId: number,
    leagueId: string,
    civIds: string[],
  ) {
    return this.prisma.client.$transaction(async (tx: any) => {
      await tx.competitionApplication.delete({
        where: { id: applicationId },
      });

      const participant = await tx.leagueParticipant.create({
        data: {
          leagueId,
          userId,
        },
      });

      await tx.playerCivilization.createMany({
        data: civIds.map((civId) => ({
          participantId: participant.id,
          civId,
        })),
      });

      return participant;
    });
  }

  async reject(applicationId: number) {
    return this.prisma.competitionApplication.delete({
      where: { id: applicationId },
    });
  }

  async findExistingParticipation(competitionId: string, userId: number) {
    return this.prisma.leagueParticipant.findFirst({
      where: {
        userId,
        league: { competitionId },
      },
    });
  }

  async findParticipationWithLeague(competitionId: string, userId: number) {
    return this.prisma.leagueParticipant.findFirst({
      where: {
        userId,
        league: { competitionId },
      },
      include: {
        league: { select: { id: true, name: true } },
      },
    });
  }
}
