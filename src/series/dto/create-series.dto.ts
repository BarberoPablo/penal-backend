import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateSeriesDto {
  @ApiProperty({ example: 'league-i' })
  @IsString()
  leagueId!: string;

  @ApiProperty()
  @IsInt()
  player1Id!: number;

  @ApiProperty()
  @IsInt()
  player2Id!: number;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  round?: number;
}
