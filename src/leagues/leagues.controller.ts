import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { LeaguesService } from './leagues.service.js';
import { CreateLeagueDto } from './dto/create-league.dto.js';
import { UpdateLeagueDto } from './dto/update-league.dto.js';
import { LeagueEntity } from './entities/league.entity.js';
import { LeagueDetailDto } from './dto/league-detail.dto.js';
import { Public } from '../auth/decorators/public.decorator.js';

@ApiTags('Leagues')
@Controller('leagues')
export class LeaguesController {
  constructor(private readonly leaguesService: LeaguesService) {}

  @Public()
  @Get()
  @ApiOkResponse({ type: LeagueEntity, isArray: true })
  findAll(@Query('competitionId') competitionId: string) {
    return this.leaguesService.findAll(competitionId);
  }

  @Public()
  @Get(':id/detail')
  @ApiOkResponse({ type: LeagueDetailDto })
  getDetail(@Param('id') id: string) {
    return this.leaguesService.getDetail(id);
  }

  // @Post()
  // create(@Body() createLeagueDto: CreateLeagueDto) {
  //   return this.leaguesService.create(createLeagueDto);
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.leaguesService.findOne(id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateLeagueDto: UpdateLeagueDto) {
  //   return this.leaguesService.update(id, updateLeagueDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.leaguesService.remove(id);
  // }
}
