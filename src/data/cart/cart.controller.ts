import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
  UseInterceptors,
  Patch,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { AuthGuard } from '@nestjs/passport';
import { LoggerInterceptor } from '../../common/logger/logger.intercepter';

@Controller('cart')
@UseGuards(AuthGuard('shop-user'))
@UseInterceptors(LoggerInterceptor)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  create(@Body() createCartDto: CreateCartDto, @Request() request) {
    return this.cartService.create(createCartDto, request.user);
  }

  @Get()
  findManyByUserId(@Request() request) {
    return this.cartService.findManyByUserId(request.user.id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCartDto: UpdateCartDto) {
    return this.cartService.update(id, updateCartDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cartService.remove(id);
  }

  @Delete()
  clear(@Request() request) {
    return this.cartService.clearCart(request.user.id);
  }
}
