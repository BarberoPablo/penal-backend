import { ApiProperty } from '@nestjs/swagger';

export class LeagueUpcomingMatchDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 'Pablo' })
  player1Name!: string;

  @ApiProperty({ example: 'TheViper' })
  player2Name!: string;

  @ApiProperty({ example: '2026-06-20' })
  date!: string;

  @ApiProperty({ example: '20:00' })
  time!: string;
}
