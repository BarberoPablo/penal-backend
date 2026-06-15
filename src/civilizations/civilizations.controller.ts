import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CivilizationsService } from './civilizations.service.js';
import { CreateCivilizationDto } from './dto/create-civilization.dto.js';
import { UpdateCivilizationDto } from './dto/update-civilization.dto.js';

@ApiTags('Civilizations')
@Controller('civilizations')
export class CivilizationsController {
  constructor(private readonly civilizationsService: CivilizationsService) {}

  @Post()
  create(@Body() createCivilizationDto: CreateCivilizationDto) {
    return this.civilizationsService.create(createCivilizationDto);
  }

  @Get()
  findAll() {
    return this.civilizationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.civilizationsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCivilizationDto: UpdateCivilizationDto,
  ) {
    return this.civilizationsService.update(id, updateCivilizationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.civilizationsService.remove(id);
  }
}
