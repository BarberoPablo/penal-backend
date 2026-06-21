import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class CreateApplicationDto {
  @ApiProperty({
    example: ['franks', 'britons', 'byzantines', 'vikings', 'japanese'],
    description: 'IDs de las 5 civilizaciones seleccionadas',
  })
  @IsArray()
  @IsString({ each: true })
  civilizationIds!: string[];
}
