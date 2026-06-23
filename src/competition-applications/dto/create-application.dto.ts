import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';
import { MIN_CIVILIZATIONS } from '../../common/constants.js';

export class CreateApplicationDto {
  @ApiProperty({
    example: ['franks', 'britons', 'byzantines', 'vikings', 'japanese'],
    description: `IDs de las ${MIN_CIVILIZATIONS} civilizaciones seleccionadas`,
  })
  @IsArray()
  @IsString({ each: true })
  civilizationIds!: string[];
}
