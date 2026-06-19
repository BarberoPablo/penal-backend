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
    const existing = await this.repository.findByUser(competitionId, userId);

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
    const application = await this.repository.findByUser(competitionId, userId);

    if (!application) return null;

    return new ApplicationResponseDto(application);
  }

  async accept(applicationId: number, competitionId: string, leagueId: string) {
    const application = await this.repository.findById(applicationId);

    if (!application) {
      throw new NotFoundException('Solicitud no encontrada.');
    }

    if (application.competitionId !== competitionId) {
      throw new BadRequestException(
        'La solicitud no pertenece a esta competición.',
      );
    }

    const existingParticipation =
      await this.repository.findExistingParticipation(
        competitionId,
        application.userId,
      );

    if (existingParticipation) {
      throw new BadRequestException(
        'El usuario ya participa en una liga de esta competición.',
      );
    }

    const civIds = application.applicationCivilizations.map((ac) => ac.civId);

    const participant = await this.repository.accept(
      applicationId,
      application.userId,
      leagueId,
      civIds,
    );

    return { participantId: participant.id, leagueId: participant.leagueId };
  }

  async reject(applicationId: number, competitionId: string) {
    const application = await this.repository.findById(applicationId);

    if (!application) {
      throw new NotFoundException('Solicitud no encontrada.');
    }

    if (application.competitionId !== competitionId) {
      throw new BadRequestException(
        'La solicitud no pertenece a esta competición.',
      );
    }

    // La aplicación se elimina completamente, permitiendo al usuario volver a aplicar en el futuro.
    await this.repository.reject(applicationId);

    return { message: 'Solicitud rechazada y eliminada.' };
  }
}
