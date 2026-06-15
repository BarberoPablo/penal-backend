export class SeriesEntity {
  id!: number;
  leagueId!: string;
  player1Id!: number;
  player2Id!: number;
  winnerId!: number | null;
  status!: string;
  round!: number;
}
