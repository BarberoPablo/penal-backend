import { ApiProperty } from '@nestjs/swagger';

export class LeagueMatchResultDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 'Pablo' })
  player1Name!: string;

  @ApiProperty({ example: 'TheViper' })
  player2Name!: string;

  @ApiProperty({ example: 3 })
  score1!: number;

  @ApiProperty({ example: 2 })
  score2!: number;

  @ApiProperty({ example: 'player1', enum: ['player1', 'player2'] })
  winner!: 'player1' | 'player2';

  @ApiProperty({ example: '2026-06-15' })
  date!: string;

  @ApiProperty({ example: 'Arabia' })
  mapName!: string;
}
