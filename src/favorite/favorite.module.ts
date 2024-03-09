import { Module } from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { FavoriteController } from './favorite.controller';
import { TrackModule } from 'src/track/track.module';
import { AlbumModule } from 'src/album/album.module';
import { ArtistModule } from 'src/artist/artist.module';

@Module({
  controllers: [FavoriteController],
  providers: [FavoriteService],
  imports: [ArtistModule, AlbumModule, TrackModule],
})
export class FavoriteModule {}
