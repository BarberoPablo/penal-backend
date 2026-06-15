import { PrismaService } from '../prisma/prisma.service.js';

export class PlayerCivilizationsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.playerCivilization.findMany({
      include: { user: true, civilization: true, league: true },
      orderBy: { id: 'desc' },
    });
  }

  async findById(id: number) {
    return this.prisma.playerCivilization.findUnique({
      where: { id },
      include: { user: true, civilization: true, league: true },
    });
  }

  async findByUserAndLeague(userId: number, leagueId: string) {
    return this.prisma.playerCivilization.findMany({
      where: { userId, leagueId },
      include: { civilization: true },
    });
  }

  async create(data: { userId: number; civId: string; leagueId: string }) {
    return this.prisma.playerCivilization.create({ data });
  }

  async delete(id: number) {
    return this.prisma.playerCivilization.delete({ where: { id } });
  }
}
