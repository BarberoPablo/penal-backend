import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  readonly client: PrismaClient;
  private readonly pool: Pool;

  constructor() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('DATABASE_URL is not defined');
    }
    this.pool = new Pool({ connectionString, max: 10 });
    const adapter = new PrismaPg(this.pool);
    this.client = new PrismaClient({ adapter });
  }

  get user() {
    return this.client.user;
  }
  get league() {
    return this.client.league;
  }
  get civilization() {
    return this.client.civilization;
  }
  get playerCivilization() {
    return this.client.playerCivilization;
  }
  get leagueParticipant() {
    return this.client.leagueParticipant;
  }
  get series() {
    return this.client.series;
  }
  get match() {
    return this.client.match;
  }
  get map() {
    return this.client.map;
  }
  get competition() {
    return this.client.competition;
  }
  get competitionAdmin() {
    return this.client.competitionAdmin;
  }
  get competitionApplication() {
    return this.client.competitionApplication;
  }
  get applicationCivilization() {
    return this.client.applicationCivilization;
  }

  async onModuleInit() {
    await this.client.$connect();
  }

  async onModuleDestroy() {
    await this.client.$disconnect();
    await this.pool.end();
  }
}
