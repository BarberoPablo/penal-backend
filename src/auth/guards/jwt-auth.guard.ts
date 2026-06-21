import { Injectable, UnauthorizedException, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator.js';
import { AUTH_COOKIE_NAME } from '../config.js';
import { AuthService, AuthUser } from '../auth.service.js';

interface RequestWithUser extends Request {
  user?: AuthUser;
}

@Injectable()
export class JwtAuthGuard {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const token = request.cookies?.[AUTH_COOKIE_NAME];

    if (!token) throw new UnauthorizedException('Missing auth token');

    try {
      const payload = this.jwtService.verify<{ sub: number; role: string }>(token);
      const user = await this.authService.validateUser({ sub: payload.sub, role: payload.role as 'USER' | 'ADMIN' });
      request.user = user;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
