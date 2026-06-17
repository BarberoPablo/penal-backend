import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateMatchDto {
  @ApiProperty()
  @IsInt()
  seriesId!: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  mapName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  winnerTeamId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  player1CivId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  player2CivId?: string;
}
