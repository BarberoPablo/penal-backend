import { PrismaService } from '../prisma/prisma.service.js';

export class LeaguesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.league.findMany({ orderBy: { name: 'asc' } });
  }

  async findById(id: string) {
    return this.prisma.league.findUnique({
      where: { id },
      include: { players: true },
    });
  }

  async create(data: {
    id: string;
    name: string;
    eloMin: number;
    eloMax?: number;
    imageUrl?: string;
  }) {
    return this.prisma.league.create({ data });
  }

  async update(
    id: string,
    data: {
      name?: string;
      eloMin?: number;
      eloMax?: number;
      imageUrl?: string;
    },
  ) {
    return this.prisma.league.update({ where: { id }, data });
  }

  async delete(id: string) {
    return this.prisma.league.delete({ where: { id } });
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
