import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CivilizationsService } from './civilizations.service.js';
import { CreateCivilizationDto } from './dto/create-civilization.dto.js';
import { UpdateCivilizationDto } from './dto/update-civilization.dto.js';
import { CivilizationEntity } from './entities/civilization.entity.js';
import { Public } from '../auth/decorators/public.decorator.js';

@ApiTags('Civilizations')
@Controller('civilizations')
export class CivilizationsController {
  constructor(private readonly civilizationsService: CivilizationsService) {}

  @Public()
  @Get()
  @ApiOkResponse({ type: CivilizationEntity, isArray: true })
  findAll() {
    return this.civilizationsService.findAll();
  }

  // @Post()
  // create(@Body() createCivilizationDto: CreateCivilizationDto) {
  //   return this.civilizationsService.create(createCivilizationDto);
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.civilizationsService.findOne(id);
  // }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateCivilizationDto: UpdateCivilizationDto,
  // ) {
  //   return this.civilizationsService.update(id, updateCivilizationDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.civilizationsService.remove(id);
  // }
}
