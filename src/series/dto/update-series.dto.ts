import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsEnum } from 'class-validator';
import { $Enums } from '../../../generated/prisma/client.js';

type SeriesStatus = $Enums.SeriesStatus;

export class UpdateSeriesDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  winnerTeamId?: number;

  @ApiPropertyOptional({ enum: ['PENDING', 'ACTIVE', 'COMPLETED', 'CANCELLED'] })
  @IsOptional()
  @IsEnum(['PENDING', 'ACTIVE', 'COMPLETED', 'CANCELLED'] as const)
  status?: SeriesStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  round?: number;
}
