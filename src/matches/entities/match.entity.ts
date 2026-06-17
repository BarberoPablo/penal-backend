export class MatchEntity {
  id!: number;
  seriesId!: number;
  mapId!: number;
  winnerId!: number | null;
  playerACivSelectionId!: number;
  playerBCivSelectionId!: number;
  completedAt!: Date | null;
}
