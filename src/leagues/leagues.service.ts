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

  findAll() {
    return this.repository.findAll();
  }

  findOne(id: string) {
    return this.repository.findById(id);
  }

  async getDetail(id: string): Promise<LeagueDetailDto | null> {
    const league = await this.repository.findById(id);
    if (!league) return null;

    const [players, series] = await Promise.all([
      this.repository.getPlayersByLeagueId(id),
      this.repository.getSeriesByLeagueId(id),
    ]);

    const standings: LeagueStandingDto[] = players.map((p, i) => ({
      rank: i + 1,
      playerName: p.displayName,
      playerInitial: p.displayName.charAt(0).toUpperCase(),
      points: p.elo,
      currentElo: p.elo,
      peakElo: p.elo,
      recentForm: [],
    }));

    const completedSeries = series.filter((s) => s.status === 'COMPLETED');
    const matches: LeagueMatchResultDto[] = completedSeries.map((s) => {
      const p1Wins = s.matches.filter(
        (m) => m.winnerId === s.player1Id,
      ).length;
      const p2Wins = s.matches.filter(
        (m) => m.winnerId === s.player2Id,
      ).length;
      const winner =
        s.winnerId === s.player1Id ? 'player1' : 'player2';
      const firstMap = s.matches[0]?.player1Civ?.name ?? '';

      return {
        id: s.id,
        player1Name: s.player1.displayName,
        player2Name: s.player2.displayName,
        score1: p1Wins,
        score2: p2Wins,
        winner,
        date: s.completedAt
          ? s.completedAt.toISOString().split('T')[0]
          : '',
        mapName: firstMap,
      };
    });

    const pendingSeries = series.filter(
      (s) => s.status === 'PENDING' || s.status === 'ACTIVE',
    );
    const upcomingMatches: LeagueUpcomingMatchDto[] = pendingSeries.map(
      (s) => {
        const date = s.scheduledAt
          ? s.scheduledAt.toISOString().split('T')[0]
          : '';
        const time = s.scheduledAt
          ? s.scheduledAt.toISOString().split('T')[1].slice(0, 5)
          : '';

        return {
          id: s.id,
          player1Name: s.player1.displayName,
          player2Name: s.player2.displayName,
          date,
          time,
        };
      },
    );

    return { league, standings, matches, upcomingMatches };
  }
}
