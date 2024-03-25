import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
//import { Track } from './interface/interface';
import { v4 as uuidv4 } from 'uuid';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Track } from './entities/track.entity';
//import { DatabaseModule } from 'src/database/database.module';

@Injectable()
export class TrackService {
  constructor(
    @InjectRepository(Track)
    private readonly trackRepository: Repository<Track>,
  ) {}

  async create(createTrackDto: CreateTrackDto): Promise<Track> {
    const { name, duration, albumId, artistId } = createTrackDto;
    if (
      name === undefined ||
      duration === undefined ||
      albumId === undefined ||
      artistId === undefined
    ) {
      throw new BadRequestException('body does not contain required fields');
    }

    /*const artist = DatabaseModule.artists.find(
      (artist) => artist.id === createTrackDto.artistId,
    );

    const album = DatabaseModule.albums.find(
      (album) => album.id === createTrackDto.albumId,
    );*/

    const newTrack: Track = this.trackRepository.create({
      id: uuidv4(),
      duration,
      name,
      artistId, // artist !== undefined ? artist.id : null, // refers to Artist
      albumId, // album !== undefined ? album.id : null, // refers to Album
    });

    // DatabaseModule.tracks.push(newTrack);
    // return newTrack;
    return await this.trackRepository.save(newTrack);
  }

  async findAll(): Promise<Track[]> {
    return this.trackRepository.find();
    //return DatabaseModule.tracks;
  }

  async findOne(id: string): Promise<Track> {
    const track = await this.trackRepository.findOne({ where: { id } });
    if (!track) {
      throw new NotFoundException(`Track with id ${id} not found`);
    }
    return track;
  }

  async update(id: string, updateTrackDto: UpdateTrackDto): Promise<Track> {
    const track = await this.trackRepository.findOne({ where: { id } });
    if (!track) throw new NotFoundException(`Track not found`);

    track.name = updateTrackDto.name;
    track.duration = updateTrackDto.duration;
    track.artistId = updateTrackDto.artistId;
    track.albumId = updateTrackDto.albumId;

    return await this.trackRepository.save(track);
  }

  async remove(id: string): Promise<Track> {
    const result = await this.trackRepository.delete(id);
    if (result.affected === 0)
      throw new NotFoundException(`Track with id ${id} not found`);
    //DatabaseModule.tracks.splice(index, 1);
    return;
  }
}
