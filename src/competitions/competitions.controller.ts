import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import type { AuthUser } from '../auth/auth.service.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { Public } from '../auth/decorators/public.decorator.js';
import { CompetitionsService } from './competitions.service.js';
import { CompetitionDetailDto } from './dto/competition-detail.dto.js';
import { CompetitionEntity } from './entities/competition.entity.js';

@ApiTags('Competitions')
@Controller('competitions')
export class CompetitionsController {
  constructor(private readonly competitionsService: CompetitionsService) {}

  @Public()
  @Get()
  @ApiOkResponse({ type: CompetitionEntity, isArray: true })
  findAll() {
    return this.competitionsService.findAll();
  }

  @Get('my-admin')
  @ApiOkResponse({ type: CompetitionDetailDto, isArray: true })
  findMyAdmin(@CurrentUser() user: AuthUser) {
    return this.competitionsService.findMyAdmin(user.id);
  }

  @Public()
  @Get(':id')
  @ApiOkResponse({ type: CompetitionDetailDto })
  findOne(@Param('id') id: string) {
    return this.competitionsService.findOne(id);
  }
}
