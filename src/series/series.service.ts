import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { SeriesRepository } from './series.repository.js';
import { CreateSeriesDto } from './dto/create-series.dto.js';
import { UpdateSeriesDto } from './dto/update-series.dto.js';

@Injectable()
export class SeriesService {
  private readonly repository: SeriesRepository;

  constructor(prisma: PrismaService) {
    this.repository = new SeriesRepository(prisma);
  }

  findAll() {
    return this.repository.findAll();
  }

  findOne(id: number) {
    return this.repository.findById(id);
  }

  create(dto: CreateSeriesDto) {
    return this.repository.create(dto);
  }

  update(id: number, dto: UpdateSeriesDto) {
    return this.repository.update(id, dto);
  }

  remove(id: number) {
    return this.repository.delete(id);
  }
}
