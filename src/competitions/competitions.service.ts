import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CompetitionsRepository } from './competitions.repository.js';

@Injectable()
export class CompetitionsService {
  private readonly repository: CompetitionsRepository;

  constructor(prisma: PrismaService) {
    this.repository = new CompetitionsRepository(prisma);
  }

  findAll() {
    return this.repository.findAll();
  }

  findOne(id: string) {
    return this.repository.findById(id);
  }

  findMyAdmin(userId: number) {
    return this.repository.findByAdmin(userId);
  }
}
