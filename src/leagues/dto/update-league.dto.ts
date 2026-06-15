import { PartialType } from '@nestjs/swagger';
import { CreateLeagueDto } from './create-league.dto.js';

export class UpdateLeagueDto extends PartialType(CreateLeagueDto) {}
