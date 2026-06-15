import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { MatchesRepository } from './matches.repository.js';
import { CreateMatchDto } from './dto/create-match.dto.js';
import { UpdateMatchDto } from './dto/update-match.dto.js';

@Injectable()
export class MatchesService {
  private readonly repository: MatchesRepository;

  constructor(prisma: PrismaService) {
    this.repository = new MatchesRepository(prisma);
  }

  findAll() {
    return this.repository.findAll();
  }

  findOne(id: number) {
    return this.repository.findById(id);
  }

  create(dto: CreateMatchDto) {
    return this.repository.create(dto);
  }

  update(id: number, dto: UpdateMatchDto) {
    return this.repository.update(id, dto);
  }

  remove(id: number) {
    return this.repository.delete(id);
  }
}
