import { PrismaService } from '../prisma/prisma.service.js';

export class MatchesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.match.findMany({
      include: { series: true },
      orderBy: { id: 'desc' },
    });
  }

  async findById(id: number) {
    return this.prisma.match.findUnique({
      where: { id },
      include: {
        series: true,
        winner: true,
        player1Civ: true,
        player2Civ: true,
      },
    });
  }

  async findBySeriesId(seriesId: number) {
    return this.prisma.match.findMany({
      where: { seriesId },
      include: { winner: true, player1Civ: true, player2Civ: true },
      orderBy: { id: 'asc' },
    });
  }

  async create(data: {
    seriesId: number;
    mapName?: string;
    winnerId?: number;
    player1CivId?: string;
    player2CivId?: string;
  }) {
    return this.prisma.match.create({ data });
  }

  async update(
    id: number,
    data: {
      mapName?: string;
      winnerId?: number;
      player1CivId?: string;
      player2CivId?: string;
      completedAt?: Date;
    },
  ) {
    return this.prisma.match.update({ where: { id }, data });
  }

  async delete(id: number) {
    return this.prisma.match.delete({ where: { id } });
  }
}
