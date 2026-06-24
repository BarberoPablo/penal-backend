import { ApiProperty } from '@nestjs/swagger';

class CivInfo {
  @ApiProperty({ example: 'franks' })
  id!: string;

  @ApiProperty({ example: 'Franks' })
  name!: string;

  @ApiProperty({ example: 'https://example.com/franks.png', type: String })
  imageUrl!: string;
}

class UserInfo {
  @ApiProperty({ example: 'PlayerName' })
  displayName!: string;

  @ApiProperty({ example: 'https://...', nullable: true, type: String })
  avatarUrl!: string | null;

  @ApiProperty({ example: 'TheViper', nullable: true, type: String })
  aoe2Alias!: string | null;

  @ApiProperty({ example: 1654, nullable: true, type: Number })
  aoe2Elo!: number | null;

  @ApiProperty({ example: 1704, nullable: true, type: Number })
  aoe2PeakElo!: number | null;

  @ApiProperty({ example: 123456, nullable: true, type: Number })
  aoe2ProfileId!: number | null;
}

export class ApplicationResponseDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ type: [CivInfo] })
  civilizations!: CivInfo[];

  @ApiProperty({ type: UserInfo, nullable: true })
  user?: UserInfo;

  constructor(data: {
    id: number;
    applicationCivilizations: {
      civilization: { id: string; name: string; imageUrl: string };
    }[];
    user?: {
      displayName: string;
      avatarUrl: string | null;
      aoe2Alias: string | null;
      aoe2Elo: number | null;
      aoe2PeakElo: number | null;
      aoe2ProfileId: number | null;
    };
  }) {
    this.id = data.id;
    this.civilizations = data.applicationCivilizations.map((ac) => ({
      id: ac.civilization.id,
      name: ac.civilization.name,
      imageUrl: ac.civilization.imageUrl,
    }));
    if (data.user) {
      this.user = {
        displayName: data.user.displayName,
        avatarUrl: data.user.avatarUrl,
        aoe2Alias: data.user.aoe2Alias,
        aoe2Elo: data.user.aoe2Elo,
        aoe2PeakElo: data.user.aoe2PeakElo,
        aoe2ProfileId: data.user.aoe2ProfileId,
      };
    }
  }
}
