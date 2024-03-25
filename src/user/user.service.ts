import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
//import { User } from './interface/interface';
import { v4 as uuidv4 } from 'uuid';
//import { DatabaseModule } from 'src/database/database.module';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    if (!createUserDto.login || !createUserDto.password) {
      throw new BadRequestException('body does not contain required fields');
    }

    const newUser: User = this.userRepository.create({
      id: uuidv4(),
      login: createUserDto.login,
      password: createUserDto.password,
      version: 1,
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
    });
    await this.userRepository.save(newUser);

    return {
      id: newUser.id,
      login: newUser.login,
      version: newUser.version,
      createdAt: newUser.createdAt ? +newUser.createdAt : null,
      updatedAt: newUser.updatedAt ? +newUser.updatedAt : null,
    };
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User doesn't exist`);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User doesn't exist`);
    }

    if (user.password !== updateUserDto.oldPassword) {
      throw new ForbiddenException(`Old password is wrong`);
    }

    user.password = updateUserDto.newPassword;
    user.version++;
    user.updatedAt = new Date().getTime();
    await this.userRepository.save(user);

    return {
      id: user.id,
      login: user.login,
      version: user.version,
      createdAt: user.createdAt ? +user.createdAt : null,
      updatedAt: user.updatedAt ? +user.updatedAt : null,
    };
  }

  async remove(id: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (user) {
      //DatabaseModule.users.splice(index, 1);
      // return;
      await this.userRepository.delete(id);
    } else {
      throw new NotFoundException(`User with id ${id} not found`);
    }
  }
}
