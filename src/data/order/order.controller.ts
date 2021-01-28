import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  UseInterceptors,
  UseGuards,
  Request,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { LoggerInterceptor } from '../../common/logger/logger.intercepter';
import { AuthGuard } from '@nestjs/passport';

@Controller()
@UseInterceptors(LoggerInterceptor)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('/shop/order')
  @UseGuards(AuthGuard('shop-user'))
  create(@Body() createOrderDto: CreateOrderDto, @Request() request) {
    return this.orderService.create(createOrderDto, request.user);
  }

  @Get('/shop/order/:orderNo')
  findOne(@Param('orderNo') orderNo: string) {
    return this.orderService.findOne(orderNo);
  }

  @Get('/admin/orders')
  findAll() {
    return this.orderService.findAll();
  }

  @Get('/shop/orders')
  @UseGuards(AuthGuard('shop-user'))
  findMany(@Request() request) {
    return this.orderService.findManyByUserId(request.user.id);
  }
}
