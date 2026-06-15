import { PartialType } from '@nestjs/swagger';
import { CreatePlayerCivilizationDto } from './create-player-civilization.dto.js';

export class UpdatePlayerCivilizationDto extends PartialType(
  CreatePlayerCivilizationDto,
) {}
