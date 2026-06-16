import { ApiProperty } from '@nestjs/swagger';
import { LeagueEntity } from '../entities/league.entity.js';
import { LeagueStandingDto } from './league-standing.dto.js';
import { LeagueMatchResultDto } from './league-match-result.dto.js';
import { LeagueUpcomingMatchDto } from './league-upcoming-match.dto.js';

export class LeagueDetailDto {
  @ApiProperty({ type: LeagueEntity })
  league!: LeagueEntity;

  @ApiProperty({ type: [LeagueStandingDto] })
  standings!: LeagueStandingDto[];

  @ApiProperty({ type: [LeagueMatchResultDto] })
  matches!: LeagueMatchResultDto[];

  @ApiProperty({ type: [LeagueUpcomingMatchDto] })
  upcomingMatches!: LeagueUpcomingMatchDto[];
}
