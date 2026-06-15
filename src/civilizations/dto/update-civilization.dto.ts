import { PartialType } from '@nestjs/swagger';
import { CreateCivilizationDto } from './create-civilization.dto.js';

export class UpdateCivilizationDto extends PartialType(CreateCivilizationDto) {}
