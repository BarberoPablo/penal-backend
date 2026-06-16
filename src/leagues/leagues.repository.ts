import { PrismaService } from '../prisma/prisma.service.js';

export class LeaguesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const leagues = await this.prisma.league.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: { select: { players: true } },
      },
    });

    const leagueIds = leagues.map((l) => l.id);
    const completedCounts = await this.prisma.series.groupBy({
      by: ['leagueId'],
      where: { leagueId: { in: leagueIds }, status: 'COMPLETED' },
      _count: { id: true },
    });

    const countMap = new Map(
      completedCounts.map((c) => [c.leagueId, c._count.id]),
    );

    return leagues.map((l) => {
      const { _count, ...rest } = l;
      return {
        ...rest,
        playerCount: _count.players,
        matchesPlayed: countMap.get(l.id) ?? 0,
      };
    });
  }

  async findById(id: string) {
    const league = await this.prisma.league.findUnique({
      where: { id },
      include: {
        _count: { select: { players: true } },
      },
    });

    if (!league) return null;

    const completedCount = await this.prisma.series.count({
      where: { leagueId: id, status: 'COMPLETED' },
    });

    const { _count, ...rest } = league;
    return {
      ...rest,
      playerCount: _count.players,
      matchesPlayed: completedCount,
    };
  }

  async getPlayersByLeagueId(leagueId: string) {
    return this.prisma.user.findMany({
      where: { leagueId },
      orderBy: { elo: 'desc' },
    });
  }

  async getSeriesByLeagueId(leagueId: string) {
    return this.prisma.series.findMany({
      where: { leagueId },
      include: {
        player1: true,
        player2: true,
        winner: true,
        matches: {
          include: { player1Civ: true, player2Civ: true, winner: true },
        },
      },
      orderBy: { id: 'desc' },
    });
  }
}
