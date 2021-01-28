import { IsNotEmpty, IsString } from 'class-validator';
import { User } from '../user.entity';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  email: string;
}

export class CreateUserRequest extends User {}
