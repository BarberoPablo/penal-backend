import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AcceptApplicationDto {
  @ApiProperty()
  @IsString()
  leagueId!: string;
}
