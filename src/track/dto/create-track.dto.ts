import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTrackDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  artistId: string | null;
  albumId: string | null;

  @IsNumber()
  duration: number;
}
