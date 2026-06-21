import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../prisma/prisma.service.js';
import { COMPETITION_ADMIN_KEY } from '../decorators/competition-admin.decorator.js';

@Injectable()
export class CompetitionAdminGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiresAdmin = this.reflector.getAllAndOverride<boolean>(
      COMPETITION_ADMIN_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiresAdmin) return true;

    const request = context
      .switchToHttp()
      .getRequest<{ params: Record<string, string>; user?: { id: number } }>();
    const competitionId = request.params.competitionId;
    const userId = request.user?.id;

    if (!competitionId || !userId) {
      throw new ForbiddenException('Access denied');
    }

    const admin = await this.prisma.competitionAdmin.findUnique({
      where: {
        competitionId_userId: { competitionId, userId },
      },
    });

    if (!admin) {
      throw new ForbiddenException(
        'You are not an administrator of this competition',
      );
    }

    return true;
  }
}
