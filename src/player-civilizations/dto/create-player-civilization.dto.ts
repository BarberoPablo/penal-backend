import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';

export class CreatePlayerCivilizationDto {
  @ApiProperty()
  @IsInt()
  participantId!: number;

  @ApiProperty()
  @IsString()
  civId!: string;
}
