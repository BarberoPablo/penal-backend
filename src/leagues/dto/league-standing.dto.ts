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

  @ApiProperty({ example: 1654, nullable: true, type: Number })
  aoe2Elo!: number | null;

  @ApiProperty({ example: 1704, nullable: true, type: Number })
  aoe2PeakElo!: number | null;

  @ApiProperty({
    example: ['W', 'L', 'W', 'W', 'L'],
    enum: ['W', 'L'],
    isArray: true,
  })
  recentForm!: ('W' | 'L')[];

  @ApiProperty({ example: ['civ-1', 'civ-2', 'civ-3', 'civ-4', 'civ-5'] })
  civilizationIds!: string[];
}
