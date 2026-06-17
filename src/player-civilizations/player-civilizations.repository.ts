import { PrismaService } from '../prisma/prisma.service.js';

export class PlayerCivilizationsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.playerCivilization.findMany({
      include: { participant: { include: { user: true, league: true } }, civilization: true },
      orderBy: { id: 'desc' },
    });
  }

  async findById(id: number) {
    return this.prisma.playerCivilization.findUnique({
      where: { id },
      include: { participant: { include: { user: true, league: true } }, civilization: true },
    });
  }

  async findByParticipantId(participantId: number) {
    return this.prisma.playerCivilization.findMany({
      where: { participantId },
      include: { civilization: true },
    });
  }

  async create(data: { participantId: number; civId: string }) {
    return this.prisma.playerCivilization.create({ data });
  }

  async delete(id: number) {
    return this.prisma.playerCivilization.delete({ where: { id } });
  }
}
