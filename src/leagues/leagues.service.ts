import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { LeaguesRepository } from './leagues.repository.js';
import { LeagueDetailDto } from './dto/league-detail.dto.js';
import { LeagueStandingDto } from './dto/league-standing.dto.js';
import { LeagueMatchResultDto } from './dto/league-match-result.dto.js';
import { LeagueUpcomingMatchDto } from './dto/league-upcoming-match.dto.js';

@Injectable()
export class LeaguesService {
  private readonly repository: LeaguesRepository;

  constructor(prisma: PrismaService) {
    this.repository = new LeaguesRepository(prisma);
  }

  findAll(competitionId: string) {
    return this.repository.findAll(competitionId);
  }

  findOne(id: string) {
    return this.repository.findById(id);
  }

  async getDetail(id: string): Promise<LeagueDetailDto | null> {
    const league = await this.repository.findById(id);
    if (!league) return null;

    const [participants, series] = await Promise.all([
      this.repository.getParticipantsByLeagueId(id),
      this.repository.getSeriesByLeagueId(id),
    ]);

    const standings: LeagueStandingDto[] = participants.map((p, i) => ({
      rank: i + 1,
      playerName: p.user.displayName,
      aoe2Alias: p.user.aoe2Alias,
      aoe2ProfileId: p.user.aoe2ProfileId,
      points: p.points,
      aoe2Elo: p.user.aoe2Elo,
      aoe2PeakElo: p.user.aoe2PeakElo,
      recentForm: [],
      civilizationIds:
        (p as any).civilizations?.map((pc: any) => pc.civId) ?? [],
    }));

    const completedSeries = series.filter((s) => s.status === 'COMPLETED');
    const matches: LeagueMatchResultDto[] = completedSeries.map((s) => {
      const p1Wins = s.matches.filter((m) => m.winnerId === s.playerAId).length;
      const p2Wins = s.matches.filter((m) => m.winnerId === s.playerBId).length;
      const winner = s.winnerId === s.playerAId ? 'player1' : 'player2';
      const firstMap = s.matches[0]?.playerACiv?.civilization?.name ?? '';

      return {
        id: s.id,
        player1Name: s.playerA.user.displayName,
        player2Name: s.playerB.user.displayName,
        score1: p1Wins,
        score2: p2Wins,
        winner,
        date: s.completedAt ? s.completedAt.toISOString().split('T')[0] : '',
        mapName: firstMap,
      };
    });

    const pendingSeries = series.filter(
      (s) => s.status === 'PENDING' || s.status === 'ACTIVE',
    );
    const upcomingMatches: LeagueUpcomingMatchDto[] = pendingSeries.map((s) => {
      const date = s.scheduledAt
        ? s.scheduledAt.toISOString().split('T')[0]
        : '';
      const time = s.scheduledAt
        ? s.scheduledAt.toISOString().split('T')[1].slice(0, 5)
        : '';

      return {
        id: s.id,
        player1Name: s.playerA.user.displayName,
        player2Name: s.playerB.user.displayName,
        date,
        time,
      };
    });

    return { league, standings, matches, upcomingMatches };
  }
}
