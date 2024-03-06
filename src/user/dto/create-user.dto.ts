import { IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  login: string;
  password: string;
}
