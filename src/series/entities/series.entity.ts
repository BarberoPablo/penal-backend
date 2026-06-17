export class SeriesEntity {
  id!: number;
  leagueId!: string;
  playerAId!: number;
  playerBId!: number;
  winnerId!: number | null;
  status!: string;
  round!: number;
}
