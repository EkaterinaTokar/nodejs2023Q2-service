import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './interface/interface';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AlbumService {
  private albums: Album[] = [];

  create(createAlbumDto: CreateAlbumDto) {
    if (!createAlbumDto.name || !createAlbumDto.year) {
      throw new BadRequestException('body does not contain required fields');
    }

    const newAlbum: Album = {
      id: uuidv4(),
      name: createAlbumDto.name,
      year: createAlbumDto.year,
      artistId: createAlbumDto.artistId, // refers to Artist
    };

    this.albums.push(newAlbum);

    return newAlbum;
  }

  findAll(): Album[] {
    return this.albums;
  }

  findOne(id: string) {
    const album = this.albums.find((album) => album.id === id);
    if (!this.isValidUUID(id)) {
      throw new BadRequestException('Invalid userId');
    }
    if (!album) {
      throw new NotFoundException(`user doesn't exist`);
    }
    return album;
  }

  private isValidUUID(id: string): boolean {
    const uuidRegex =
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    return uuidRegex.test(id);
  }

  update(id: string, updateAlbumDto: UpdateAlbumDto) {
    this.albums = this.albums.map((album) => {
      if (album.id === id) {
        return {
          ...album,
          ...updateAlbumDto,
        };
      }
      return album;
    });
    return this.findOne(id);
  }

  remove(id: string) {
    const index = this.albums.findIndex((n) => n.id === id);
    if (index !== -1) {
      this.albums.splice(index, 1);
      return this.albums;
    }
  }
}
