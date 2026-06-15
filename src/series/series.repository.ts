import { $Enums } from '../../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';

type SeriesStatus = $Enums.SeriesStatus;

export class SeriesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.series.findMany({
      include: { player1: true, player2: true, matches: true },
      orderBy: { id: 'desc' },
    });
  }

  async findById(id: number) {
    return this.prisma.series.findUnique({
      where: { id },
      include: {
        player1: true,
        player2: true,
        winner: true,
        matches: {
          include: { player1Civ: true, player2Civ: true, winner: true },
        },
      },
    });
  }

  async findByLeagueId(leagueId: string) {
    return this.prisma.series.findMany({
      where: { leagueId },
      include: { player1: true, player2: true, winner: true, matches: true },
      orderBy: { id: 'desc' },
    });
  }

  async create(data: {
    leagueId: string;
    player1Id: number;
    player2Id: number;
    round?: number;
  }) {
    return this.prisma.series.create({ data });
  }

  async update(
    id: number,
    data: { winnerId?: number; status?: SeriesStatus; round?: number },
  ) {
    return this.prisma.series.update({ where: { id }, data });
  }

  async delete(id: number) {
    return this.prisma.series.delete({ where: { id } });
  }
}
