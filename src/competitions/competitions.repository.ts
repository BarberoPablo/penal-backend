import { PrismaService } from '../prisma/prisma.service.js';

export class CompetitionsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.competition.findMany({
      orderBy: { name: 'asc' },
      include: {
        admins: {
          include: { user: { select: { displayName: true } } },
          take: 1,
        },
      },
    });
  }

  async findById(id: string) {
    return this.prisma.competition.findUnique({
      where: { id },
      include: {
        leagues: {
          orderBy: { eloMin: 'desc' },
        },
        admins: {
          include: { user: { select: { displayName: true } } },
        },
      },
    });
  }
}
