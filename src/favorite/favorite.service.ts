import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Favorite } from './entities/favorite.entity';
import { Artist } from 'src/artist/entities/artist.entity';
import { Album } from 'src/album/entities/album.entity';
import { Track } from 'src/track/entities/track.entity';

@Injectable()
export class FavoriteService {
  constructor(
    @InjectRepository(Favorite)
    private favoriteRepository: Repository<Favorite>,
    private readonly entityManager: EntityManager,
  ) {}
  async findAll() {
    const favorites = await this.favoriteRepository.find({
      relations: ['albums', 'artists', 'tracks'],
    });

    const artists = favorites.flatMap((favorite) => favorite.artists);
    const albums = favorites.flatMap((favorite) => favorite.albums);
    const tracks = favorites.flatMap((favorite) => favorite.tracks);

    return {
      artists,
      albums,
      tracks,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async create(id: string, createFavoriteDto: CreateFavoriteDto) {
    const artistRepository = this.entityManager.getRepository(Artist);
    const albumRepository = this.entityManager.getRepository(Album);
    const trackRepository = this.entityManager.getRepository(Track);

    const artist = await artistRepository.findOne({ where: { id } });
    const album = await albumRepository.findOne({ where: { id } });
    const track = await trackRepository.findOne({ where: { id } });

    if (!artist && !album && !track) {
      throw new UnprocessableEntityException(`Id doesn't exist`);
    }

    const favorite = new Favorite();
    favorite.artists = artist ? [artist] : [];
    favorite.albums = album ? [album] : [];
    favorite.tracks = track ? [track] : [];

    return await this.favoriteRepository.save(favorite);
  }

  async remove(id: string) {
    const favorites = await this.favoriteRepository.find({
      relations: ['albums', 'artists', 'tracks'],
    });

    for (const favorite of favorites) {
      const trackIndex = favorite.tracks.findIndex((track) => track.id === id);
      const albumIndex = favorite.albums.findIndex((album) => album.id === id);
      const artistIndex = favorite.artists.findIndex(
        (artist) => artist.id === id,
      );

      if (trackIndex !== -1) {
        favorite.tracks.splice(trackIndex, 1);
        await this.favoriteRepository.save(favorite);
        return;
      } else if (albumIndex !== -1) {
        favorite.albums.splice(albumIndex, 1);
        await this.favoriteRepository.save(favorite);
        return;
      } else if (artistIndex !== -1) {
        favorite.artists.splice(artistIndex, 1);
        await this.favoriteRepository.save(favorite);
        return;
      }
    }
    throw new NotFoundException('Item not found in favorites');
  }
}
