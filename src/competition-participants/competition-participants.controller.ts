import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CompetitionAdmin } from '../auth/decorators/competition-admin.decorator.js';
import { CompetitionParticipantsService } from './competition-participants.service.js';
import { ParticipantResponseDto } from './dto/participant-response.dto.js';
import { UpdateParticipantDto } from './dto/update-participant.dto.js';

@ApiTags('Competition Participants')
@Controller('competitions/:competitionId/participants')
export class CompetitionParticipantsController {
  constructor(
    private readonly participantsService: CompetitionParticipantsService,
  ) {}

  @CompetitionAdmin()
  @Get()
  @ApiOkResponse({ type: ParticipantResponseDto, isArray: true })
  findAll(@Param('competitionId') competitionId: string) {
    return this.participantsService.findAll(competitionId);
  }

  @CompetitionAdmin()
  @Patch(':id')
  @ApiOkResponse({ type: ParticipantResponseDto })
  update(
    @Param('competitionId') competitionId: string,
    @Param('id') id: string,
    @Body() dto: UpdateParticipantDto,
  ) {
    return this.participantsService.update(+id, competitionId, dto);
  }
}
