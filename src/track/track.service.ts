import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './interface/interface';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TrackService {
  private tracks: Track[] = [];

  create(createTrackDto: CreateTrackDto) {
    if (!createTrackDto.name || !createTrackDto.duration) {
      throw new BadRequestException('body does not contain required fields');
    }

    const newTrack: Track = {
      id: uuidv4(),
      name: createTrackDto.name,
      artistId: createTrackDto.artistId,
      albumId: createTrackDto.albumId,
      duration: createTrackDto.duration,
    };

    this.tracks.push(newTrack);

    return newTrack;
  }

  findAll(): Track[] {
    return this.tracks;
  }

  findOne(id: string) {
    const track = this.tracks.find((track) => track.id === id);
    if (!this.isValidUUID(id)) {
      throw new BadRequestException('Invalid trackId');
    }
    if (!track) {
      throw new NotFoundException(`track doesn't exist`);
    }
    return track;
  }

  private isValidUUID(id: string): boolean {
    const uuidRegex =
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    return uuidRegex.test(id);
  }

  update(id: string, updateTrackDto: UpdateTrackDto) {
    this.tracks = this.tracks.map((track) => {
      if (track.id === id) {
        return {
          ...track,
          ...updateTrackDto,
        };
      }
      return track;
    });
    return this.findOne(id);
  }

  remove(id: string) {
    const index = this.tracks.findIndex((n) => n.id === id);
    if (index !== -1) {
      this.tracks.splice(index, 1);
      return this.tracks;
    }
  }
}
