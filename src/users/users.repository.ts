import { PrismaService } from '../prisma/prisma.service.js';

export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany({ orderBy: { displayName: 'asc' } });
  }

  async findById(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        participations: {
          include: {
            league: true,
            civilizations: { include: { civilization: true } },
          },
        },
      },
    });
  }

  async findBySteamId(steamId: string) {
    return this.prisma.user.findUnique({
      where: { steamId },
      include: {
        participations: { include: { league: true } },
      },
    });
  }

  async create(data: {
    steamId?: string;
    displayName: string;
    avatarUrl?: string;
    aoe2ProfileId?: number;
    aoe2Alias?: string;
    aoe2Elo?: number;
    aoe2PeakElo?: number;
    aoe2LastSync?: Date;
  }) {
    return this.prisma.user.create({ data });
  }

  async update(
    id: number,
    data: {
      displayName?: string;
      avatarUrl?: string;
      aoe2ProfileId?: number;
      aoe2Alias?: string;
      aoe2Elo?: number;
      aoe2PeakElo?: number;
      aoe2LastSync?: Date;
    },
  ) {
    return this.prisma.user.update({ where: { id }, data });
  }

  async delete(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }
}
