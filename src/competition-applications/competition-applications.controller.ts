import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CompetitionApplicationsService } from './competition-applications.service.js';
import { CreateApplicationDto } from './dto/create-application.dto.js';
import { ApplicationResponseDto } from './dto/application-response.dto.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { Public } from '../auth/decorators/public.decorator.js';
import type { AuthUser } from '../auth/auth.service.js';

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
}
