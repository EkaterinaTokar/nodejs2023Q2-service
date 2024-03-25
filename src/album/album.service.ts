import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
//import { Album } from './interface/interface';
import { v4 as uuidv4 } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Album } from './entities/album.entity';
//import { DatabaseModule } from 'src/database/database.module';

@Injectable()
export class AlbumService {
  constructor(
    @InjectRepository(Album)
    private readonly albumRepository: Repository<Album>,
  ) {}
  async create(createAlbumDto: CreateAlbumDto) {
    const { name, year, artistId } = createAlbumDto;
    if (name === undefined || year === undefined || artistId === undefined) {
      throw new BadRequestException('body does not contain required fields');
    }

    /*const artist = DatabaseModule.artists.find(
      (artist) => artist.id === createAlbumDto.artistId,
    );

    const newAlbum: Album = {
      id: uuidv4(),
      name,
      year,
      artistId: artist !== undefined ? artist.id : null, // refers to Artist
    };

    DatabaseModule.albums.push(newAlbum);
    return newAlbum;*/

    const newAlbum = this.albumRepository.create({
      id: uuidv4(),
      name,
      year,
      artistId,
    });

    return await this.albumRepository.save(newAlbum);
  }

  async findAll(): Promise<Album[]> {
    //return DatabaseModule.albums;
    return await this.albumRepository.find();
  }

  async findOne(id: string): Promise<Album> {
    const album = await this.albumRepository.findOne({ where: { id } });
    if (!album) {
      throw new NotFoundException(`album doesn't exist`);
    }
    return album;
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto): Promise<Album> {
    const album = await this.albumRepository.findOne({ where: { id } });
    if (!album) throw new NotFoundException(`Album doesn't exist`);

    album.name = updateAlbumDto.name;
    album.year = updateAlbumDto.year;
    album.artistId = updateAlbumDto.artistId;

    return await this.albumRepository.save(album);
  }

  async remove(id: string): Promise<void> {
    const album = await this.findOne(id);
    if (!album) throw new NotFoundException(`Album not found`);

    /* DatabaseModule.albums.splice(index, 1);
    DatabaseModule.favorites.albums = DatabaseModule.favorites.albums.filter(
      (albumId) => albumId !== id,
    );
    DatabaseModule.tracks.forEach((track) => {
      if (track.albumId === id) track.albumId = null;
    });
  }*/
    await this.albumRepository.remove(album);
  }
}
