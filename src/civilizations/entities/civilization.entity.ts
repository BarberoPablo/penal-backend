import { ApiProperty } from '@nestjs/swagger';

export class CivilizationEntity {
  @ApiProperty({ example: 'franks' })
  id!: string;

  @ApiProperty({ example: 'Franks' })
  name!: string;

  @ApiProperty({ example: 'https://example.com/franks.png', nullable: true, type: String })
  imageUrl!: string | null;

  @ApiProperty({ example: 240 })
  cost!: number;
}
