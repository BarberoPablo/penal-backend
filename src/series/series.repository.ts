import { $Enums } from '../../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';

type SeriesStatus = $Enums.SeriesStatus;

export class SeriesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.series.findMany({
      include: {
        playerA: { include: { user: true } },
        playerB: { include: { user: true } },
        matches: true,
      },
      orderBy: { id: 'desc' },
    });
  }

  async findById(id: number) {
    return this.prisma.series.findUnique({
      where: { id },
      include: {
        playerA: { include: { user: true } },
        playerB: { include: { user: true } },
        winner: { include: { user: true } },
        matches: {
          include: {
            playerACiv: { include: { civilization: true } },
            playerBCiv: { include: { civilization: true } },
            winner: { include: { user: true } },
          },
        },
      },
    });
  }

  async findByLeagueId(leagueId: string) {
    return this.prisma.series.findMany({
      where: { leagueId },
      include: {
        playerA: { include: { user: true } },
        playerB: { include: { user: true } },
        winner: { include: { user: true } },
        matches: true,
      },
      orderBy: { id: 'desc' },
    });
  }

  async create(data: {
    leagueId: string;
    playerAId: number;
    playerBId: number;
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
