export class SeriesEntity {
  id!: number;
  competitionId!: string;
  teamAId!: number;
  teamBId!: number;
  winnerTeamId!: number | null;
  status!: string;
  round!: number;
}
