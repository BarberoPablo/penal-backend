import { PrismaService } from '../prisma/prisma.service.js';

export class MatchesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.match.findMany({
      include: { series: true, map: true },
      orderBy: { id: 'desc' },
    });
  }

  async findById(id: number) {
    return this.prisma.match.findUnique({
      where: { id },
      include: {
        series: true,
        map: true,
        winner: { include: { user: true } },
        playerACiv: { include: { civilization: true } },
        playerBCiv: { include: { civilization: true } },
      },
    });
  }

  async findBySeriesId(seriesId: number) {
    return this.prisma.match.findMany({
      where: { seriesId },
      include: {
        map: true,
        winner: { include: { user: true } },
        playerACiv: { include: { civilization: true } },
        playerBCiv: { include: { civilization: true } },
      },
      orderBy: { id: 'asc' },
    });
  }

  async create(data: {
    seriesId: number;
    mapId: number;
    playerACivSelectionId: number;
    playerBCivSelectionId: number;
    winnerId?: number;
  }) {
    return this.prisma.match.create({ data });
  }

  async update(
    id: number,
    data: {
      mapId?: number;
      winnerId?: number;
      playerACivSelectionId?: number;
      playerBCivSelectionId?: number;
      completedAt?: Date;
    },
  ) {
    return this.prisma.match.update({ where: { id }, data });
  }

  async delete(id: number) {
    return this.prisma.match.delete({ where: { id } });
  }
}
