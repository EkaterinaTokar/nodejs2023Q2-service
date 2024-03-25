import { Module } from '@nestjs/common';
import { Album } from 'src/album/interface/interface';
import { Artist } from 'src/artist/interface/interface';
import { Favorites } from 'src/favorite/interface/interface';
import { Track } from 'src/track/interface/interface';
import { User } from 'src/user/interface/interface';

@Module({})
export class DatabaseModule {
  static artists: Artist[] = [];
  static albums: Album[] = [];
  static tracks: Track[] = [];
  static users: User[] = [];
  static favorites: Favorites = {
    artists: [],
    albums: [],
    tracks: [],
  };
}
