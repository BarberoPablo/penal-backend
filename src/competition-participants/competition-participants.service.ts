import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CompetitionParticipantsRepository } from './competition-participants.repository.js';
import { ParticipantResponseDto } from './dto/participant-response.dto.js';
import { UpdateParticipantDto } from './dto/update-participant.dto.js';

@Injectable()
export class CompetitionParticipantsService {
  private readonly repository: CompetitionParticipantsRepository;

  constructor(prisma: PrismaService) {
    this.repository = new CompetitionParticipantsRepository(prisma);
  }

  async findAll(competitionId: string) {
    const participants = await this.repository.findByCompetition(competitionId);
    return participants.map((p) => new ParticipantResponseDto(p));
  }

  async update(
    participantId: number,
    competitionId: string,
    dto: UpdateParticipantDto,
  ) {
    const participant = await this.repository.findById(participantId);

    if (!participant) {
      throw new NotFoundException('Participant not found.');
    }

    if (participant.league.competitionId !== competitionId) {
      throw new BadRequestException(
        'The participant does not belong to this competition.',
      );
    }

    if (participant.leagueId === dto.leagueId) {
      throw new BadRequestException(
        'Participant already in the target league.',
      );
    }

    const targetLeague = await this.repository.findLeagueById(dto.leagueId);

    if (!targetLeague || targetLeague.competitionId !== competitionId) {
      throw new BadRequestException(
        'The target league does not belong to this competition or does not exist.',
      );
    }

    const existing = await this.repository.findExistingInLeague(
      dto.leagueId,
      participant.userId,
    );

    if (existing) {
      throw new BadRequestException(
        'The user is already registered in the target league.',
      );
    }

    const updated = await this.repository.updateLeague(
      participantId,
      dto.leagueId,
    );

    return new ParticipantResponseDto(updated);
  }
}
