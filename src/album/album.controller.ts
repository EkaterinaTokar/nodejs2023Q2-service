import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  HttpStatus,
} from '@nestjs/common';
import { AlbumService } from './album.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';

@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Post()
  create(@Body() createAlbumDto: CreateAlbumDto) {
    const newAlbum = this.albumService.create(createAlbumDto);
    return {
      statusCode: HttpStatus.CREATED,
      data: newAlbum,
    };
  }

  @Get()
  findAll() {
    return this.albumService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const album = this.albumService.findOne(id);
    return {
      statusCode: HttpStatus.OK,
      data: album,
    };
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateAlbumDto: UpdateAlbumDto) {
    const updateAlbum = this.albumService.update(id, updateAlbumDto);
    return {
      statusCode: HttpStatus.CREATED,
      data: updateAlbum,
    };
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    const albums = this.albumService.remove(id);
    return {
      statusCode: HttpStatus.CREATED,
      data: albums,
    };
  }
}
