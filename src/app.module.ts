import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './database/database.module';
import { TrackModule } from './track/track.module';
import { ArtistModule } from './artist/artist.module';
@Module({
  imports: [UserModule, DatabaseModule, TrackModule, ArtistModule],
  controllers: [AppController],
  providers: [AppService],
  exports: [],
})
export class AppModule {}
