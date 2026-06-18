import { ApiProperty } from '@nestjs/swagger';

class AdminInfo {
  @ApiProperty({ example: 'Admin' })
  displayName!: string;
}

export class CompetitionEntity {
  @ApiProperty({ example: 'liga-penal' })
  id!: string;

  @ApiProperty({ example: 'Liga Penal' })
  name!: string;

  @ApiProperty({ example: 'Competición por ligas basada en el rating ELO.', nullable: true, type: String })
  description!: string | null;

  @ApiProperty({ example: 'https://example.com/image.png', nullable: true, type: String })
  imageUrl!: string | null;

  @ApiProperty({ type: [AdminInfo] })
  admins!: AdminInfo[];
}
