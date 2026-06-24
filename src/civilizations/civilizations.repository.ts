import { PrismaService } from '../prisma/prisma.service.js';

export class CivilizationsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.civilization.findMany({ orderBy: { name: 'asc' } });
  }

  async findById(id: string) {
    return this.prisma.civilization.findUnique({ where: { id } });
  }

  async create(data: {
    id: string;
    name: string;
    imageUrl: string;
    cost: number;
  }) {
    return this.prisma.civilization.create({ data });
  }

  async update(
    id: string,
    data: { name?: string; imageUrl?: string; cost?: number },
  ) {
    return this.prisma.civilization.update({ where: { id }, data });
  }

  async delete(id: string) {
    return this.prisma.civilization.delete({ where: { id } });
  }
}
