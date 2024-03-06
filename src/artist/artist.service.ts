import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './interface/interface';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ArtistService {
  private artists: Artist[] = [];

  create(createArtistDto: CreateArtistDto) {
    if (!createArtistDto.name || !createArtistDto.grammy) {
      throw new BadRequestException('body does not contain required fields');
    }

    const newArtist: Artist = {
      id: uuidv4(),
      name: createArtistDto.name,
      grammy: createArtistDto.grammy,
    };

    this.artists.push(newArtist);

    return newArtist;
  }

  findAll() {
    return this.artists;
  }

  findOne(id: string) {
    const artist = this.artists.find((artist) => artist.id === id);
    if (!this.isValidUUID(id)) {
      throw new BadRequestException('Invalid userId');
    }
    if (!artist) {
      throw new NotFoundException(`user doesn't exist`);
    }
    return artist;
  }

  private isValidUUID(id: string): boolean {
    const uuidRegex =
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    return uuidRegex.test(id);
  }

  update(id: string, updateArtistDto: UpdateArtistDto) {
    this.artists = this.artists.map((artist) => {
      if (artist.id === id) {
        return {
          ...artist,
          ...updateArtistDto,
        };
      }
      return artist;
    });
    return this.findOne(id);
  }

  remove(id: string) {
    const index = this.artists.findIndex((n) => n.id === id);
    if (index !== -1) {
      this.artists.splice(index, 1);
      return this.artists;
    }
  }
}
