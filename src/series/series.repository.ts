import { $Enums } from '../../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';

type SeriesStatus = $Enums.SeriesStatus;

export class SeriesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.series.findMany({
      include: {
        teamA: { include: { members: { include: { user: true } } } },
        teamB: { include: { members: { include: { user: true } } } },
        matches: true,
      },
      orderBy: { id: 'desc' },
    });
  }

  async findById(id: number) {
    return this.prisma.series.findUnique({
      where: { id },
      include: {
        teamA: { include: { members: { include: { user: true } } } },
        teamB: { include: { members: { include: { user: true } } } },
        winner: { include: { members: { include: { user: true } } } },
        matches: {
          include: { player1Civ: true, player2Civ: true, winnerTeam: { include: { members: { include: { user: true } } } } },
        },
      },
    });
  }

  async findByLeagueId(leagueId: string) {
    return this.prisma.series.findMany({
      where: { competitionId: leagueId },
      include: {
        teamA: { include: { members: { include: { user: true } } } },
        teamB: { include: { members: { include: { user: true } } } },
        winner: { include: { members: { include: { user: true } } } },
        matches: true,
      },
      orderBy: { id: 'desc' },
    });
  }

  async create(data: {
    competitionId: string;
    teamAId: number;
    teamBId: number;
    round?: number;
  }) {
    return this.prisma.series.create({ data });
  }

  async update(
    id: number,
    data: { winnerTeamId?: number; status?: SeriesStatus; round?: number },
  ) {
    return this.prisma.series.update({ where: { id }, data });
  }

  async delete(id: number) {
    return this.prisma.series.delete({ where: { id } });
  }
}
