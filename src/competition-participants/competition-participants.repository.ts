import { PrismaService } from '../prisma/prisma.service.js';

export class CompetitionParticipantsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByCompetition(competitionId: string) {
    return this.prisma.leagueParticipant.findMany({
      where: {
        league: { competitionId },
      },
      include: {
        user: { select: { id: true, displayName: true, avatarUrl: true } },
        league: { select: { name: true } },
      },
      orderBy: { id: 'asc' },
    });
  }

  async findById(id: number) {
    return this.prisma.leagueParticipant.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, displayName: true, avatarUrl: true } },
        league: { select: { id: true, name: true, competitionId: true } },
      },
    });
  }

  async findExistingInLeague(leagueId: string, userId: number) {
    return this.prisma.leagueParticipant.findUnique({
      where: {
        leagueId_userId: { leagueId, userId },
      },
    });
  }

  async updateLeague(participantId: number, newLeagueId: string) {
    return this.prisma.leagueParticipant.update({
      where: { id: participantId },
      data: { leagueId: newLeagueId },
      include: {
        user: { select: { id: true, displayName: true, avatarUrl: true } },
        league: { select: { name: true } },
      },
    });
  }

  async findLeagueById(leagueId: string) {
    return this.prisma.league.findUnique({
      where: { id: leagueId },
    });
  }
}
