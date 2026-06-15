import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';

export class CreatePlayerCivilizationDto {
  @ApiProperty()
  @IsInt()
  userId!: number;

  @ApiProperty()
  @IsString()
  civId!: string;

  @ApiProperty()
  @IsString()
  leagueId!: string;
}
