import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './interface/interface';
import { v4 as uuidv4 } from 'uuid';
import { DatabaseModule } from 'src/database/database.module';

@Injectable()
export class TrackService {
  create(createTrackDto: CreateTrackDto) {
    const { name, duration, albumId, artistId } = createTrackDto;
    if (
      name === undefined ||
      duration === undefined ||
      albumId === undefined ||
      artistId === undefined
    ) {
      throw new BadRequestException('body does not contain required fields');
    }

    const artist = DatabaseModule.artists.find(
      (artist) => artist.id === createTrackDto.artistId,
    );

    const album = DatabaseModule.albums.find(
      (album) => album.id === createTrackDto.albumId,
    );

    const newTrack: Track = {
      id: uuidv4(),
      duration: createTrackDto.duration,
      name: createTrackDto.name,
      artistId: artist !== undefined ? artist.id : null, // refers to Artist
      albumId: album !== undefined ? album.id : null, // refers to Album
    };

    DatabaseModule.tracks.push(newTrack);
    return newTrack;
  }

  findAll(): Track[] {
    return DatabaseModule.tracks;
  }

  findOne(id: string): Track {
    const track = DatabaseModule.tracks.find((track) => track.id === id);
    if (!track) {
      throw new NotFoundException(`Track with id ${id} not found`);
    }
    return track;
  }

  update(id: string, updateTrackDto: UpdateTrackDto) {
    const index = DatabaseModule.tracks.findIndex((track) => track.id === id);
    if (index === -1) throw new NotFoundException(`Track not found`);

    const updatedTrack = {
      ...DatabaseModule.tracks[index],
      ...updateTrackDto,
    };

    DatabaseModule.tracks[index] = updatedTrack;
    return updatedTrack;
  }

  remove(id: string) {
    const index = DatabaseModule.tracks.findIndex((n) => n.id === id);
    if (index === -1)
      throw new NotFoundException(`Track with id ${id} not found`);
    DatabaseModule.tracks.splice(index, 1);
    return;
  }
}
