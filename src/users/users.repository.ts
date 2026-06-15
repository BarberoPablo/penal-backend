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
        league: true,
        playerCivilizations: { include: { civilization: true } },
      },
    });
  }

  async findBySteamId(steamId: string) {
    return this.prisma.user.findUnique({
      where: { steamId },
      include: { league: true },
    });
  }

  async create(data: {
    steamId?: string;
    displayName: string;
    avatarUrl?: string;
    elo?: number;
    leagueId?: string;
  }) {
    return this.prisma.user.create({ data });
  }

  async update(
    id: number,
    data: {
      displayName?: string;
      avatarUrl?: string;
      elo?: number;
      leagueId?: string;
    },
  ) {
    return this.prisma.user.update({ where: { id }, data });
  }

  async delete(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }
}
