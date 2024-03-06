import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  //@UsePipes(new ValidationPipe())
  @Post()
  create(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    const newUser = this.userService.create(createUserDto);
    return {
      statusCode: HttpStatus.CREATED,
      data: newUser,
    };
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const user = this.userService.findOne(id);
    return {
      statusCode: HttpStatus.OK,
      data: user,
    };
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const updateUser = this.userService.update(id, updateUserDto);
    return {
      statusCode: HttpStatus.CREATED,
      data: updateUser,
    };
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    const users = this.userService.remove(id);
    return {
      statusCode: HttpStatus.CREATED,
      data: users,
    };
  }
}
