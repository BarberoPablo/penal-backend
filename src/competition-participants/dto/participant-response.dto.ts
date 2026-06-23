import { ApiProperty } from '@nestjs/swagger';

export class ParticipantResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  leagueId: string;

  @ApiProperty()
  leagueName: string;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  userDisplayName: string;

  @ApiProperty({ nullable: true, type: String })
  userAvatarUrl: string | null;

  @ApiProperty()
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
