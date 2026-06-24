import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CookieOptions } from 'express';
import {
  AOE2_LB_1V1_RANDOM_MAP,
  getAoe2ProfileBySteamIdUrl,
} from '../common/aoe2-api-urls.js';
import { PrismaService } from '../prisma/prisma.service.js';
import {
  extractSteamId,
  fetchSteamProfile,
  verifySteamLogin,
} from './steam-openid.js';

export interface JwtPayload {
  sub: number;
  role: 'USER' | 'ADMIN';
}

export interface AuthUser {
  id: number;
  steamId: string | null;
  displayName: string;
  avatarUrl: string | null;
  role: 'USER' | 'ADMIN';
  aoe2ProfileId: number | null;
  aoe2Alias: string | null;
  aoe2Elo: number | null;
  aoe2PeakElo: number | null;
  aoe2LastSync: Date | null;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async handleSteamCallback(query: Record<string, string>) {
    const isValid = await verifySteamLogin(query);
    if (!isValid) throw new Error('Steam login verification failed');

    const claimedId = query['openid.claimed_id'] ?? query['openid.identity'];
    if (!claimedId) throw new Error('Missing Steam ID in response');

    const steamId = extractSteamId(claimedId);
    if (!steamId) throw new Error('Invalid Steam ID');

    const profile = await fetchSteamProfile(steamId);
    const aoe2Profile = await this.fetchAoe2Profile(steamId);

    const user = await this.prisma.user.upsert({
      where: { steamId },
      create: {
        steamId: profile.steamId,
        displayName: profile.displayName,
        avatarUrl: profile.avatarUrl,
        aoe2ProfileId: aoe2Profile?.profileId ?? null,
        aoe2Alias: aoe2Profile?.alias ?? null,
        aoe2Elo: aoe2Profile?.elo ?? null,
        aoe2PeakElo: aoe2Profile?.peakElo ?? null,
        aoe2LastSync: aoe2Profile ? new Date() : null,
      },
      update: {
        displayName: profile.displayName,
        avatarUrl: profile.avatarUrl,
        aoe2ProfileId: aoe2Profile?.profileId ?? null,
        aoe2Alias: aoe2Profile?.alias ?? null,
        aoe2Elo: aoe2Profile?.elo ?? null,
        aoe2PeakElo: aoe2Profile?.peakElo ?? null,
        aoe2LastSync: aoe2Profile ? new Date() : null,
      },
    });

    const token = this.jwtService.sign({ sub: user.id, role: user.role });

    return { user: this.mapUser(user), token };
  }

  async validateUser(payload: JwtPayload): Promise<AuthUser> {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: {
        participations: { include: { league: true } },
      },
    });

    if (!user) throw new Error('User not found');

    return this.mapUser(user);
  }

  getCookieConfig(): CookieOptions {
    return {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    };
  }

  private async fetchAoe2Profile(steamId: string): Promise<{
    profileId: number;
    alias: string;
    elo: number | null;
    peakElo: number | null;
  } | null> {
    try {
      const url = getAoe2ProfileBySteamIdUrl(steamId);
      const res = await fetch(url);
      if (!res.ok) return null;

      const data = await res.json();
      if (data.result?.code !== 0) return null;

      const member = data.statGroups?.[0]?.members?.[0];
      if (!member?.profile_id) return null;

      const lbStats = data.leaderboardStats ?? [];
      const lb1v1 = lbStats.find(
        (lb: { leaderboard_id: number }) =>
          lb.leaderboard_id === AOE2_LB_1V1_RANDOM_MAP,
      );

      return {
        profileId: member.profile_id,
        alias: member.alias ?? null,
        elo: lb1v1?.rating ?? null,
        peakElo: lb1v1?.highestrating ?? null,
      };
    } catch {
      return null;
    }
  }

  private mapUser(user: {
    id: number;
    steamId: string | null;
    displayName: string;
    avatarUrl: string | null;
    role: 'USER' | 'ADMIN';
    aoe2ProfileId: number | null;
    aoe2Alias: string | null;
    aoe2Elo: number | null;
    aoe2PeakElo: number | null;
    aoe2LastSync: Date | null;
  }): AuthUser {
    return {
      id: user.id,
      steamId: user.steamId,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl,
      role: user.role,
      aoe2ProfileId: user.aoe2ProfileId,
      aoe2Alias: user.aoe2Alias,
      aoe2Elo: user.aoe2Elo,
      aoe2PeakElo: user.aoe2PeakElo,
      aoe2LastSync: user.aoe2LastSync,
    };
  }
}
