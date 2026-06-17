export class UserEntity {
  id!: number;
  steamId!: string | null;
  displayName!: string;
  avatarUrl!: string | null;
  elo!: number;
}
