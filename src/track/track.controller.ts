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
import { TrackService } from './track.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';

@Controller('track')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Post()
  create(@Body() createTrackDto: CreateTrackDto) {
    const newTrack = this.trackService.create(createTrackDto);
    return {
      statusCode: HttpStatus.CREATED,
      data: newTrack,
    };
  }

  @Get()
  findAll() {
    return this.trackService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.trackService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateTrackDto: UpdateTrackDto) {
    const updateTrack = this.trackService.update(id, updateTrackDto);
    return {
      statusCode: HttpStatus.CREATED,
      data: updateTrack,
    };
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    const tracks = this.trackService.remove(id);
    return {
      statusCode: HttpStatus.CREATED,
      data: tracks,
    };
  }
}
