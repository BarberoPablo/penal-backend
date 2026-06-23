import { ApiProperty } from '@nestjs/swagger';
import { ApplicationResponseDto } from './application-response.dto.js';

class ParticipationInfo {
  //export it to use in the frontend?
  @ApiProperty({ example: 'league-i' })
  leagueId!: string;

  @ApiProperty({ example: 'League I' })
  leagueName!: string;
}

export class GetMyStatusDto {
  @ApiProperty({ type: ApplicationResponseDto, nullable: true })
  application!: ApplicationResponseDto | null;

  @ApiProperty({ type: ParticipationInfo, nullable: true })
  participation!: ParticipationInfo | null;

  constructor(data: {
    application: ApplicationResponseDto | null;
    participation: { leagueId: string; leagueName: string } | null;
  }) {
    this.application = data.application;
    this.participation = data.participation;
  }
}
