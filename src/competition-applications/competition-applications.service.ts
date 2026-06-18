import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CompetitionApplicationsRepository } from './competition-applications.repository.js';
import { CreateApplicationDto } from './dto/create-application.dto.js';
import { ApplicationResponseDto } from './dto/application-response.dto.js';

@Injectable()
export class CompetitionApplicationsService {
  private readonly repository: CompetitionApplicationsRepository;

  constructor(prisma: PrismaService) {
    this.repository = new CompetitionApplicationsRepository(prisma);
  }

  async create(
    competitionId: string,
    userId: number,
    dto: CreateApplicationDto,
  ) {
    const existing = await this.repository.findPendingByUser(
      competitionId,
      userId,
    );

    if (existing) {
      throw new BadRequestException(
        'Ya tienes una solicitud pendiente para esta competición.',
      );
    }

    if (!dto.civilizationIds || dto.civilizationIds.length < 5) {
      throw new BadRequestException(
        'Debes seleccionar exactamente 5 civilizaciones.',
      );
    }

    const application = await this.repository.create(
      competitionId,
      userId,
      dto.civilizationIds,
    );

    return new ApplicationResponseDto(application);
  }

  async getMyApplication(competitionId: string, userId: number) {
    const application = await this.repository.findPendingByUser(
      competitionId,
      userId,
    );

    if (!application) return null;

    return new ApplicationResponseDto(application);
  }
}
