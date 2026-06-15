import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CivilizationsRepository } from './civilizations.repository.js';
import { CreateCivilizationDto } from './dto/create-civilization.dto.js';
import { UpdateCivilizationDto } from './dto/update-civilization.dto.js';

@Injectable()
export class CivilizationsService {
  private readonly repository: CivilizationsRepository;

  constructor(prisma: PrismaService) {
    this.repository = new CivilizationsRepository(prisma);
  }

  findAll() {
    return this.repository.findAll();
  }

  findOne(id: string) {
    return this.repository.findById(id);
  }

  create(dto: CreateCivilizationDto) {
    return this.repository.create(dto);
  }

  update(id: string, dto: UpdateCivilizationDto) {
    return this.repository.update(id, dto);
  }

  remove(id: string) {
    return this.repository.delete(id);
  }
}
