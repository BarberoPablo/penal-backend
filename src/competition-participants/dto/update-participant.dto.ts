import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateParticipantDto {
  @ApiProperty()
  @IsString()
  leagueId!: string;
}
