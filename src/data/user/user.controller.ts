import {
  Controller,
  Get,
  Post,
  Body,
  Headers,
  UseInterceptors,
  Patch,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoggerInterceptor } from '../../common/logger/logger.intercepter';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller()
@UseInterceptors(LoggerInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/shop/user')
  create(@Body() createUserDto: CreateUserDto, @Headers('x-auth-key') idToken) {
    return this.userService.create(createUserDto, idToken);
  }

  @Get('/admin/user')
  @UseGuards(AuthGuard('admin-user'))
  findAll() {
    return this.userService.findAll();
  }

  @Get('/shop/user')
  @UseGuards(AuthGuard('shop-user'))
  findOne(@Request() request) {
    return this.userService.findOne(request.user.id);
  }

  @Patch('/shop/user')
  @UseGuards(AuthGuard('shop-user'))
  update(@Request() request, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(request.user.id, updateUserDto);
  }
}
