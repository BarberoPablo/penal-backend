import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import type { AuthUser } from '../auth/auth.service.js';
import { CompetitionAdmin } from '../auth/decorators/competition-admin.decorator.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { CompetitionApplicationsService } from './competition-applications.service.js';
import { ApplicationResponseDto } from './dto/application-response.dto.js';
import { CreateApplicationDto } from './dto/create-application.dto.js';

@ApiTags('Competition Applications')
@Controller('competitions/:competitionId/applications')
export class CompetitionApplicationsController {
  constructor(
    private readonly applicationsService: CompetitionApplicationsService,
  ) {}

  @Post()
  @ApiCreatedResponse({ type: ApplicationResponseDto })
  create(
    @Param('competitionId') competitionId: string,
    @CurrentUser() user: AuthUser,
    @Body() dto: CreateApplicationDto,
  ) {
    return this.applicationsService.create(competitionId, user.id, dto);
  }

  @Get('mine')
  @ApiOkResponse({ type: ApplicationResponseDto, nullable: true })
  getMine(
    @Param('competitionId') competitionId: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.applicationsService.getMyApplication(competitionId, user.id);
  }

  @CompetitionAdmin()
  @Get()
  @ApiOkResponse({ type: ApplicationResponseDto, isArray: true })
  findAll(@Param('competitionId') competitionId: string) {
    return this.applicationsService.findAll(competitionId);
  }

  @CompetitionAdmin()
  @Post(':id/accept')
  accept(
    @Param('competitionId') competitionId: string,
    @Param('id') id: string,
    @Body('leagueId') leagueId: string,
  ) {
    return this.applicationsService.accept(+id, competitionId, leagueId);
  }

  @CompetitionAdmin()
  @Post(':id/reject')
  reject(
    @Param('competitionId') competitionId: string,
    @Param('id') id: string,
  ) {
    return this.applicationsService.reject(+id, competitionId);
  }
}
