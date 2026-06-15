import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateLeagueDto {
  @ApiProperty({ example: 'league-i' })
  @IsString()
  id!: string;

  @ApiProperty({ example: 'League I' })
  @IsString()
  name!: string;

  @ApiProperty({ example: 2000 })
  @IsInt()
  @Min(0)
  eloMin!: number;

  @ApiPropertyOptional({ example: 2199 })
  @IsOptional()
  @IsInt()
  @Min(0)
  eloMax?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  imageUrl?: string;
}
