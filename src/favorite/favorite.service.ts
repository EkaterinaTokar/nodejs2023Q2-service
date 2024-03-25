import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { DatabaseModule } from 'src/database/database.module';
import { EntityManager, Repository } from 'typeorm';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Favorite } from './entities/favorite.entity';
import { Artist } from 'src/artist/entities/artist.entity';
import { Album } from 'src/album/entities/album.entity';
import { Track } from 'src/track/entities/track.entity';

@Injectable()
export class FavoriteService {
  constructor(
    @InjectRepository(Favorite)
    private favoriteRepository: Repository<Favorite>,
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {}
  async findAll() {
    // const favorites = {
    //   artists: DatabaseModule.artists.filter((artist) =>
    //     DatabaseModule.favorites.artists.includes(artist.id),
    //   ),
    //   albums: DatabaseModule.albums.filter((album) =>
    //     DatabaseModule.favorites.albums.includes(album.id),
    //   ),
    //   tracks: DatabaseModule.tracks.filter((track) =>
    //     DatabaseModule.favorites.tracks.includes(track.id),
    //   ),
    // };
    // return favorites;
    const favorite = await this.favoriteRepository.findOne({
      where: { id: 1 },
    });
    const artists = await this.favoriteRepository
      .createQueryBuilder('favorite')
      .relation(Favorite, 'artists')
      .of(favorite)
      .loadMany();
    const albums = await this.favoriteRepository
      .createQueryBuilder('favorite')
      .relation(Favorite, 'albums')
      .of(favorite)
      .loadMany();
    const tracks = await this.favoriteRepository
      .createQueryBuilder('favorite')
      .relation(Favorite, 'tracks')
      .of(favorite)
      .loadMany();

    return { artists, albums, tracks };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async create(id: string, createFavoriteDto: CreateFavoriteDto) {
    // const trackExists = DatabaseModule.tracks.some((track) => track.id === id);
    // const albumExists = DatabaseModule.albums.some((album) => album.id === id);
    // const artistExists = DatabaseModule.artists.some(
    //   (artist) => artist.id === id,
    // );
    // if (!trackExists && !albumExists && !artistExists) {
    //   throw new UnprocessableEntityException(`Id doesn't exist`);
    // }
    // if (trackExists) {
    //   DatabaseModule.favorites.tracks.push(id);
    // }
    // if (albumExists) {
    //   DatabaseModule.favorites.albums.push(id);
    // }
    // if (artistExists) {
    //   DatabaseModule.favorites.artists.push(id);
    // }
    // return 'Item added to favorites';

    const entity = await this.getEntityById(id);
    if (!entity) {
      throw new UnprocessableEntityException(`Item with id '${id}' does not exist`);
    }

    const favorite = await this.favoriteRepository.findOne(1); // Предполагая, что у вас есть только одна запись избранных
    if (entity instanceof Artist) {
      favorite.artists.push(entity);
    } else if (entity instanceof Album) {
      favorite.albums.push(entity);
    } else if (entity instanceof Track) {
      favorite.tracks.push(entity);
    }

    await this.favoriteRepository.save(favorite);

    return 'Item added to favorites';
  }

  remove(id: string) {
    const trackIndex = DatabaseModule.favorites.tracks.findIndex(
      (track) => track === id,
    );
    const albumIndex = DatabaseModule.favorites.albums.findIndex(
      (album) => album === id,
    );
    const artistIndex = DatabaseModule.favorites.artists.findIndex(
      (artist) => artist === id,
    );

    if (trackIndex !== -1) {
      DatabaseModule.favorites.tracks.splice(trackIndex, 1);
      return DatabaseModule.favorites;
    } else if (albumIndex !== -1) {
      DatabaseModule.favorites.albums.splice(albumIndex, 1);
      return DatabaseModule.favorites;
    } else if (artistIndex !== -1) {
      DatabaseModule.favorites.artists.splice(artistIndex, 1);
      return DatabaseModule.favorites;
    } else {
      throw new NotFoundException('Item not found in favorites');
    }
  }
}
