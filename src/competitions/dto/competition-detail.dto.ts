import { ApiProperty } from '@nestjs/swagger';

class AdminInfo {
  @ApiProperty({ example: 'Admin' })
  displayName!: string;
}

class LeagueInfo {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  eloMin!: number;

  @ApiProperty({ type: Number, nullable: true })
  eloMax!: number | null;
}

export class CompetitionDetailDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty({ nullable: true, type: String })
  description!: string | null;

  @ApiProperty({ nullable: true, type: String })
  imageUrl!: string | null;

  @ApiProperty({ type: [AdminInfo] })
  admins!: AdminInfo[];

  @ApiProperty({ type: [LeagueInfo] })
  leagues!: LeagueInfo[];
}
