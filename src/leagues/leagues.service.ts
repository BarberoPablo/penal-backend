import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { LeaguesRepository } from './leagues.repository.js';
import { CreateLeagueDto } from './dto/create-league.dto.js';
import { UpdateLeagueDto } from './dto/update-league.dto.js';

@Injectable()
export class LeaguesService {
  private readonly repository: LeaguesRepository;

  constructor(prisma: PrismaService) {
    this.repository = new LeaguesRepository(prisma);
  }

  findAll() {
    return this.repository.findAll();
  }

  findOne(id: string) {
    return this.repository.findById(id);
  }

  create(dto: CreateLeagueDto) {
    return this.repository.create(dto);
  }

  update(id: string, dto: UpdateLeagueDto) {
    return this.repository.update(id, dto);
  }

  remove(id: string) {
    return this.repository.delete(id);
  }
}
