export class UserEntity {
  id!: number;
  steamId!: string | null;
  displayName!: string;
  avatarUrl!: string | null;
  aoe2ProfileId!: number | null;
  aoe2Alias!: string | null;
  aoe2Elo!: number | null;
  aoe2PeakElo!: number | null;
  aoe2LastSync!: Date | null;
}
