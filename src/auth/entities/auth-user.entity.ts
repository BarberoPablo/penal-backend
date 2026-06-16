import { ApiProperty } from '@nestjs/swagger';

export class AuthUserEntity {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: '76561197960287930', nullable: true, type: String })
  steamId!: string | null;

  @ApiProperty({ example: 'Pablo' })
  displayName!: string;

  @ApiProperty({ example: 'https://avatars.steamstatic.com/abc.jpg', nullable: true, type: String })
  avatarUrl!: string | null;

  @ApiProperty({ enum: ['USER', 'ADMIN'] })
  role!: 'USER' | 'ADMIN';

  @ApiProperty({ example: 1000 })
  elo!: number;
}
