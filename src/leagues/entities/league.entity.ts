import { ApiProperty } from '@nestjs/swagger';

export class LeagueEntity {
  @ApiProperty({ example: 'league-i' })
  id!: string;

  @ApiProperty({ example: 'League I' })
  name!: string;

  @ApiProperty({ example: 2000 })
  eloMin!: number;

  @ApiProperty({ example: 2199, nullable: true, type: Number })
  eloMax!: number | null;

  @ApiProperty({ example: 10 })
  playerCount!: number;

  @ApiProperty({ example: 25 })
  matchesPlayed!: number;

  @ApiProperty({ example: 'https://example.com/image.png', nullable: true, type: String })
  imageUrl!: string | null;
}
