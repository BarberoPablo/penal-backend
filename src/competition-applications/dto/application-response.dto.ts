import { ApiProperty } from '@nestjs/swagger';

class CivInfo {
  @ApiProperty({ example: 'franks' })
  id!: string;

  @ApiProperty({ example: 'Franks' })
  name!: string;
}

class UserInfo {
  @ApiProperty({ example: 'PlayerName' })
  displayName!: string;

  @ApiProperty({ example: 'https://...', nullable: true })
  avatarUrl!: string | null;
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
    applicationCivilizations: { civilization: { id: string; name: string } }[];
    user?: { displayName: string; avatarUrl: string | null };
  }) {
    this.id = data.id;
    this.civilizations = data.applicationCivilizations.map((ac) => ({
      id: ac.civilization.id,
      name: ac.civilization.name,
    }));
    if (data.user) {
      this.user = {
        displayName: data.user.displayName,
        avatarUrl: data.user.avatarUrl,
      };
    }
  }
}
