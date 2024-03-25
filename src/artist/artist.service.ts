import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
//import { Artist } from './interface/interface';
import { v4 as uuidv4 } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { Artist } from './entities/artist.entity';
import { Repository } from 'typeorm';
import { Album } from 'src/album/entities/album.entity';
import { Track } from 'src/track/entities/track.entity';
//import { DatabaseModule } from 'src/database/database.module';

@Injectable()
export class ArtistService {
  constructor(
    @InjectRepository(Artist)
    private readonly artistRepository: Repository<Artist>,
  ) {}
  async create(createArtistDto: CreateArtistDto) {
    const { name, grammy } = createArtistDto;
    if (name === undefined || grammy === undefined) {
      throw new BadRequestException('body does not contain required fields');
    }

    const newArtist: Artist = {
      id: uuidv4(),
      name,
      grammy,
      albums: [],
      tracks: [],
    };

    // DatabaseModule.artists.push(newArtist);
    // return newArtist;
    return await this.artistRepository.save(newArtist);
  }

  async findAll(): Promise<Artist[]> {
    return this.artistRepository.find();
    //return DatabaseModule.artists;
  }

  async findOne(id: string): Promise<Artist> {
    const artist = await this.artistRepository.findOne({ where: { id } });
    if (!artist) {
      throw new NotFoundException(`Artist ${id} doesn't exist`);
    }
    return artist;
  }

  async update(id: string, updateArtistDto: UpdateArtistDto) {
    const artist = await this.artistRepository.findOne({ where: { id } });
    if (!artist) throw new NotFoundException(`Artist ${id} doesn't exist`);

    /* const updatedArtist = {
      ...DatabaseModule.artists[index],
      ...updateArtistDto,
    };

    DatabaseModule.artists[index] = updatedArtist;
    return updatedArtist;*/
    artist.name = updateArtistDto.name;
    artist.grammy = updateArtistDto.grammy;

    return await this.artistRepository.save(artist);
  }

  async remove(id: string) {
    const result = await this.artistRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException(`Artist not found`);

    /*DatabaseModule.artists.splice(index, 1);
    DatabaseModule.favorites.artists = DatabaseModule.favorites.artists.filter(
      (artistId) => artistId !== id,
    );
    DatabaseModule.tracks.forEach((track) => {
      if (track.artistId === id) track.artistId = null;
    });
    DatabaseModule.albums.forEach((album) => {
      if (album.artistId === id) album.artistId = null;
    });*/
  }
}
