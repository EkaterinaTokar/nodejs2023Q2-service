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
import { ArtistService } from './artist.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';

@Controller('artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Post()
  create(@Body() createArtistDto: CreateArtistDto) {
    const newArtist = this.artistService.create(createArtistDto);
    return {
      statusCode: HttpStatus.CREATED,
      data: newArtist,
    };
  }

  @Get()
  findAll() {
    return this.artistService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const artist = this.artistService.findOne(id);
    return {
      statusCode: HttpStatus.OK,
      data: artist,
    };
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateArtistDto: UpdateArtistDto) {
    const updateArtist = this.artistService.update(id, updateArtistDto);
    return {
      statusCode: HttpStatus.CREATED,
      data: updateArtist,
    };
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    const artists = this.artistService.remove(id);
    return {
      statusCode: HttpStatus.CREATED,
      data: artists,
    };
  }
}
