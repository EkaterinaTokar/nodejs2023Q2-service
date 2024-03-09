import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  ParseUUIDPipe,
} from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';

@Controller('favs')
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @Get()
  findAll() {
    return this.favoriteService.findAll();
  }

  @Post('/track/:id')
  @HttpCode(201)
  createForTrack(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() createFavoriteDto: CreateFavoriteDto,
  ) {
    return this.favoriteService.create(id, createFavoriteDto);
  }

  @Delete('/track/:id')
  @HttpCode(204)
  removeTrack(@Param('id', ParseUUIDPipe) id: string) {
    return this.favoriteService.remove(id);
  }

  @Post('/album/:id')
  @HttpCode(201)
  createForAlbum(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() createFavoriteDto: CreateFavoriteDto,
  ) {
    return this.favoriteService.create(id, createFavoriteDto);
  }

  @Delete('/album/:id')
  @HttpCode(204)
  removeAlbum(@Param('id', ParseUUIDPipe) id: string) {
    return this.favoriteService.remove(id);
  }

  @Post('/artist/:id')
  @HttpCode(201)
  createForArtist(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() createFavoriteDto: CreateFavoriteDto,
  ) {
    return this.favoriteService.create(id, createFavoriteDto);
  }

  @Delete('/artist/:id')
  @HttpCode(204)
  removeArtist(@Param('id', ParseUUIDPipe) id: string) {
    return this.favoriteService.remove(id);
  }
}
