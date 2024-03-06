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

@Injectable()
export class UserService {
  private users: User[] = [];

  create(createUserDto: CreateUserDto) {
    if (!createUserDto.login || !createUserDto.password) {
      throw new BadRequestException('body does not contain required fields');
    }

    const { login, password } = createUserDto;

    const newUser: User = {
      id: uuidv4(),
      login,
      password,
      version: 1,
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
    };

    this.users.push(newUser);

    return newUser;
  }

  findAll(): User[] {
    return this.users;
  }

  findOne(id: string) {
    const user = this.users.find((user) => user.id === id);
    if (!this.isValidUUID(id)) {
      throw new BadRequestException('Invalid userId');
    }
    if (!user) {
      throw new NotFoundException(`user doesn't exist`);
    }
    return user;
  }

  private isValidUUID(id: string): boolean {
    const uuidRegex =
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    return uuidRegex.test(id);
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    this.users = this.users.map((user) => {
      if (user.id === id) {
        if (user.password === updateUserDto.oldPassword) {
          return {
            ...user,
            password: updateUserDto.newPassword,
            ...updateUserDto,
          };
        }
        throw new ForbiddenException(`oldPassword is wrong`);
      }
      return user;
    });
    return this.findOne(id);
  }

  remove(id: string) {
    const index = this.users.findIndex((n) => n.id === id);
    if (index !== -1) {
      this.users.splice(index, 1);
      return this.users;
    }
  }
}
