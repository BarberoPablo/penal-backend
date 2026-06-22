export class ParticipantResponseDto {
  id: number;
  leagueId: string;
  leagueName: string;
  userId: number;
  userDisplayName: string;
  userAvatarUrl: string | null;
  points: number;

  constructor(participant: any) {
    this.id = participant.id;
    this.leagueId = participant.leagueId;
    this.leagueName = participant.league?.name ?? "";
    this.userId = participant.user?.id ?? participant.userId;
    this.userDisplayName = participant.user?.displayName ?? `Usuario #${participant.userId}`;
    this.userAvatarUrl = participant.user?.avatarUrl ?? null;
    this.points = participant.points;
  }
}
