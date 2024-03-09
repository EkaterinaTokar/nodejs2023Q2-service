import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './interface/interface';
import { v4 as uuidv4 } from 'uuid';
import { DatabaseModule } from 'src/database/database.module';

@Injectable()
export class ArtistService {
  create(createArtistDto: CreateArtistDto) {
    const { name, grammy } = createArtistDto;
    if (name === undefined || grammy === undefined) {
      throw new BadRequestException('body does not contain required fields');
    }

    const newArtist: Artist = {
      id: uuidv4(),
      name,
      grammy,
    };

    DatabaseModule.artists.push(newArtist);
    return newArtist;
  }

  findAll() {
    return DatabaseModule.artists;
  }

  findOne(id: string) {
    const artist = DatabaseModule.artists.find((artist) => artist.id === id);
    if (!artist) {
      throw new NotFoundException(`Artist ${id} doesn't exist`);
    }
    return artist;
  }

  update(id: string, updateArtistDto: UpdateArtistDto) {
    const index = DatabaseModule.artists.findIndex(
      (artist) => artist.id === id,
    );
    if (index === -1) throw new NotFoundException(`Artist ${id} doesn't exist`);

    const updatedArtist = {
      ...DatabaseModule.artists[index],
      ...updateArtistDto,
    };

    DatabaseModule.artists[index] = updatedArtist;
    return updatedArtist;
  }

  remove(id: string) {
    const index = DatabaseModule.artists.findIndex(
      (artist) => artist.id === id,
    );
    if (index === -1) throw new NotFoundException(`Artist not found`);

    DatabaseModule.artists.splice(index, 1);
    DatabaseModule.favorites.artists = DatabaseModule.favorites.artists.filter(
      (artistId) => artistId !== id,
    );
    DatabaseModule.tracks.forEach((track) => {
      if (track.artistId === id) track.artistId = null;
    });
    DatabaseModule.albums.forEach((album) => {
      if (album.artistId === id) album.artistId = null;
    });
  }
}
