import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';

export class CreateMatchDto {
  @ApiProperty()
  @IsInt()
  seriesId!: number;

  @ApiProperty()
  @IsInt()
  mapId!: number;

  @ApiProperty()
  @IsInt()
  playerACivSelectionId!: number;

  @ApiProperty()
  @IsInt()
  playerBCivSelectionId!: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  winnerId?: number;
}
