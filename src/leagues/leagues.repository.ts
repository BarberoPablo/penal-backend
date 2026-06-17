import { PrismaService } from '../prisma/prisma.service.js';

export class LeaguesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const leagues = await this.prisma.league.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: { select: { participants: true } },
      },
    });

    const leagueIds = leagues.map((l) => l.id);
    const completedCounts = await this.prisma.series.groupBy({
      by: ['competitionId'],
      where: { competitionId: { in: leagueIds }, status: 'COMPLETED' },
      _count: { id: true },
    });

    const countMap = new Map(
      completedCounts.map((c) => [c.competitionId, c._count.id]),
    );

    return leagues.map((l) => {
      const { _count, ...rest } = l;
      return {
        ...rest,
        playerCount: _count.participants,
        matchesPlayed: countMap.get(l.id) ?? 0,
      };
    });
  }

  async findById(id: string) {
    const league = await this.prisma.league.findUnique({
      where: { id },
      include: {
        _count: { select: { participants: true } },
      },
    });

    if (!league) return null;

    const completedCount = await this.prisma.series.count({
      where: { competitionId: id, status: 'COMPLETED' },
    });

    const { _count, ...rest } = league;
    return {
      ...rest,
      playerCount: _count.participants,
      matchesPlayed: completedCount,
    };
  }

  async getParticipantsByLeagueId(leagueId: string) {
    return this.prisma.leagueParticipant.findMany({
      where: { leagueId },
      include: { user: true },
      orderBy: { points: 'desc' },
    });
  }

  async getSeriesByLeagueId(leagueId: string) {
    return this.prisma.series.findMany({
      where: { competitionId: leagueId },
      include: {
        teamA: { include: { members: { include: { user: true } } } },
        teamB: { include: { members: { include: { user: true } } } },
        winner: { include: { members: { include: { user: true } } } },
        matches: {
          include: { player1Civ: true, player2Civ: true, winnerTeam: { include: { members: { include: { user: true } } } } },
        },
      },
      orderBy: { id: 'desc' },
    });
  }
}
