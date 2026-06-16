import { ApiProperty } from '@nestjs/swagger';

export class LeagueStandingDto {
  @ApiProperty({ example: 1 })
  rank!: number;

  @ApiProperty({ example: 'Pablo' })
  playerName!: string;

  @ApiProperty({ example: 'P' })
  playerInitial!: string;

  @ApiProperty({ example: 2150 })
  points!: number;

  @ApiProperty({ example: 2150 })
  currentElo!: number;

  @ApiProperty({ example: 2150 })
  peakElo!: number;

  @ApiProperty({ example: ['W', 'L', 'W', 'W', 'L'], enum: ['W', 'L'], isArray: true })
  recentForm!: ('W' | 'L')[];
}
