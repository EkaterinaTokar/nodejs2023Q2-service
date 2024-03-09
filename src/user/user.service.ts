import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './interface/interface';
import { v4 as uuidv4 } from 'uuid';
import { DatabaseModule } from 'src/database/database.module';

@Injectable()
export class UserService {
  create(createUserDto: CreateUserDto) {
    if (!createUserDto.login || !createUserDto.password) {
      throw new BadRequestException('body does not contain required fields');
    }

    const newUser: User = {
      id: uuidv4(),
      login: createUserDto.login,
      password: createUserDto.password,
      version: 1,
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
    };
    DatabaseModule.users.push(newUser);

    return {
      id: newUser.id,
      login: newUser.login,
      version: newUser.version,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    };
  }

  findAll(): User[] {
    return DatabaseModule.users;
  }

  findOne(id: string) {
    const user = DatabaseModule.users.find((user) => user.id === id);
    if (!user) {
      throw new NotFoundException(`User doesn't exist`);
    }
    return user;
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    const user = DatabaseModule.users.find((user) => user.id === id);
    if (!user) {
      throw new NotFoundException(`User doesn't exist`);
    }

    if (user.password !== updateUserDto.oldPassword) {
      throw new ForbiddenException(`Old password is wrong`);
    }

    user.password = updateUserDto.newPassword;
    user.version++;
    user.updatedAt = new Date().getTime();

    return {
      id: user.id,
      login: user.login,
      version: user.version,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  remove(id: string) {
    const index = DatabaseModule.users.findIndex((n) => n.id === id);
    if (index !== -1) {
      DatabaseModule.users.splice(index, 1);
      return;
    } else {
      throw new NotFoundException(`User with id ${id} not found`);
    }
  }
}
