export class MatchEntity {
  id!: number;
  seriesId!: number;
  mapName!: string | null;
  winnerTeamId!: number | null;
  player1CivId!: string | null;
  player2CivId!: string | null;
  completedAt!: Date | null;
}
