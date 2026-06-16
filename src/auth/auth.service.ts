import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CookieOptions } from 'express';
import { PrismaService } from '../prisma/prisma.service.js';
import { authConfig } from './config.js';
import { verifySteamLogin, extractSteamId, fetchSteamProfile } from './steam-openid.js';

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
  elo: number;
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

    const user = await this.prisma.user.upsert({
      where: { steamId },
      create: {
        steamId: profile.steamId,
        displayName: profile.displayName,
        avatarUrl: profile.avatarUrl,
      },
      update: {
        displayName: profile.displayName,
        avatarUrl: profile.avatarUrl,
      },
    });

    const token = this.jwtService.sign({ sub: user.id, role: user.role });

    return { user: this.mapUser(user), token };
  }

  async validateUser(payload: JwtPayload): Promise<AuthUser> {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
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

  private mapUser(user: {
    id: number;
    steamId: string | null;
    displayName: string;
    avatarUrl: string | null;
    role: 'USER' | 'ADMIN';
    elo: number;
  }): AuthUser {
    return {
      id: user.id,
      steamId: user.steamId,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl,
      role: user.role,
      elo: user.elo,
    };
  }
}
