import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PlayerCivilizationsService } from './player-civilizations.service.js';
import { CreatePlayerCivilizationDto } from './dto/create-player-civilization.dto.js';

@ApiTags('Player Civilizations')
@Controller('player-civilizations')
export class PlayerCivilizationsController {
  constructor(
    private readonly playerCivilizationsService: PlayerCivilizationsService,
  ) {}

  @Post()
  create(@Body() createPlayerCivilizationDto: CreatePlayerCivilizationDto) {
    return this.playerCivilizationsService.create(createPlayerCivilizationDto);
  }

  @Get()
  findAll() {
    return this.playerCivilizationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.playerCivilizationsService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.playerCivilizationsService.remove(id);
  }
}
