import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateCivilizationDto {
  @ApiProperty({ example: 'franks' })
  @IsString()
  id!: string;

  @ApiProperty({ example: 'Franks' })
  @IsString()
  name!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({ example: 240 })
  @IsInt()
  @Min(0)
  baseCost!: number;
}
