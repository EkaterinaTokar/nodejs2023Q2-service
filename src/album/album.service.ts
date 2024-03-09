import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './interface/interface';
import { v4 as uuidv4 } from 'uuid';
import { DatabaseModule } from 'src/database/database.module';

@Injectable()
export class AlbumService {
  create(createAlbumDto: CreateAlbumDto) {
    const { name, year, artistId } = createAlbumDto;
    if (name === undefined || year === undefined || artistId === undefined) {
      throw new BadRequestException('body does not contain required fields');
    }

    const artist = DatabaseModule.artists.find(
      (artist) => artist.id === createAlbumDto.artistId,
    );

    const newAlbum: Album = {
      id: uuidv4(),
      name,
      year,
      artistId: artist !== undefined ? artist.id : null, // refers to Artist
    };

    DatabaseModule.albums.push(newAlbum);
    return newAlbum;
  }

  findAll(): Album[] {
    return DatabaseModule.albums;
  }

  findOne(id: string): Album {
    const album = DatabaseModule.albums.find((album) => album.id === id);
    if (!album) {
      throw new NotFoundException(`album doesn't exist`);
    }
    return album;
  }

  update(id: string, updateAlbumDto: UpdateAlbumDto) {
    const index = DatabaseModule.albums.findIndex((album) => album.id === id);
    if (index === -1) throw new NotFoundException(`Album doesn't exist`);

    const updatedAlbum = {
      ...DatabaseModule.albums[index],
      ...updateAlbumDto,
    };

    DatabaseModule.albums[index] = updatedAlbum;

    return updatedAlbum;
  }

  remove(id: string) {
    const index = DatabaseModule.albums.findIndex((album) => album.id === id);
    if (index === -1) throw new NotFoundException(`Album not found`);

    DatabaseModule.albums.splice(index, 1);
    DatabaseModule.favorites.albums = DatabaseModule.favorites.albums.filter(
      (albumId) => albumId !== id,
    );
    DatabaseModule.tracks.forEach((track) => {
      if (track.albumId === id) track.albumId = null;
    });
  }
}
