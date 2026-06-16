import { Controller, Get, Post, Req, Res, HttpCode, Redirect } from '@nestjs/common';
import { ApiTags, ApiExcludeEndpoint, ApiOkResponse } from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service.js';
import type { AuthUser } from './auth.service.js';
import { AuthUserEntity } from './entities/auth-user.entity.js';
import { buildSteamLoginUrl } from './steam-openid.js';
import { authConfig } from './config.js';
import { Public } from './decorators/public.decorator.js';
import { CurrentUser } from './decorators/current-user.decorator.js';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Get('steam')
  @Redirect()
  steamLogin() {
    const returnUrl = `${authConfig.frontendUrl}/api/auth/steam/return`;
    return { url: buildSteamLoginUrl(returnUrl, authConfig.frontendUrl) };
  }

  @Public()
  @ApiExcludeEndpoint()
  @Get('steam/return')
  async steamReturn(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const query = req.query as Record<string, string>;
    const { user, token } = await this.authService.handleSteamCallback(query);

    res.cookie('token', token, this.authService.getCookieConfig());

    return res.redirect(authConfig.frontendUrl);
  }

  @Public()
  @Post('logout')
  @HttpCode(200)
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('token', { path: '/' });
    return { message: 'Logged out' };
  }

  @Get('me')
  @ApiOkResponse({ type: AuthUserEntity })
  getMe(@CurrentUser() user: AuthUser) {
    return user;
  }
}
