import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateSeriesDto {
  @ApiProperty({ example: 'league-i', description: 'ID of the competition (currently references League.id)' })
  @IsString()
  competitionId!: string;

  @ApiProperty()
  @IsInt()
  teamAId!: number;

  @ApiProperty()
  @IsInt()
  teamBId!: number;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  round?: number;
}
