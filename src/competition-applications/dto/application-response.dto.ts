import { ApiProperty } from '@nestjs/swagger';

class CivInfo {
  @ApiProperty({ example: 'franks' })
  id!: string;

  @ApiProperty({ example: 'Franks' })
  name!: string;
}

export class ApplicationResponseDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ enum: ['PENDING', 'ACCEPTED', 'REJECTED'] })
  status!: string;

  @ApiProperty({ type: [CivInfo] })
  civilizations!: CivInfo[];

  constructor(data: {
    id: number;
    status: string;
    applicationCivilizations: { civilization: { id: string; name: string } }[];
  }) {
    this.id = data.id;
    this.status = data.status;
    this.civilizations = data.applicationCivilizations.map((ac) => ({
      id: ac.civilization.id,
      name: ac.civilization.name,
    }));
  }
}
