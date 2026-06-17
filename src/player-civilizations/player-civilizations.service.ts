import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { PlayerCivilizationsRepository } from './player-civilizations.repository.js';
import { CreatePlayerCivilizationDto } from './dto/create-player-civilization.dto.js';

@Injectable()
export class PlayerCivilizationsService {
  private readonly repository: PlayerCivilizationsRepository;

  constructor(prisma: PrismaService) {
    this.repository = new PlayerCivilizationsRepository(prisma);
  }

  findAll() {
    return this.repository.findAll();
  }

  findOne(id: number) {
    return this.repository.findById(id);
  }

  findByParticipantId(participantId: number) {
    return this.repository.findByParticipantId(participantId);
  }

  create(dto: CreatePlayerCivilizationDto) {
    return this.repository.create(dto);
  }

  remove(id: number) {
    return this.repository.delete(id);
  }
}
