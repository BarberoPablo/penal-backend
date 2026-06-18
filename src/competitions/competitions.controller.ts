import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CompetitionsService } from './competitions.service.js';
import { CompetitionEntity } from './entities/competition.entity.js';
import { Public } from '../auth/decorators/public.decorator.js';

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

  @Public()
  @Get(':id')
  @ApiOkResponse({ type: CompetitionEntity })
  findOne(@Param('id') id: string) {
    return this.competitionsService.findOne(id);
  }
}
