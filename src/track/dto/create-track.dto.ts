import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTrackDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  artistId: string | null;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  albumId: string | null;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  duration: number;
}
