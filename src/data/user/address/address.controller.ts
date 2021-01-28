import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Patch,
  UseInterceptors,
} from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { AuthGuard } from '@nestjs/passport';
import { UpdateAddressDto } from './dto/update-address.dto';
import { LoggerInterceptor } from '../../../common/logger/logger.intercepter';

@Controller('address')
@UseGuards(AuthGuard('shop-user'))
@UseInterceptors(LoggerInterceptor)
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  async create(@Request() request, @Body() createAddressDto: CreateAddressDto) {
    return await this.addressService.create(createAddressDto, request.user);
  }

  @Patch()
  async update(@Request() request, @Body() updateAddressDto: UpdateAddressDto) {
    return await this.addressService.update(updateAddressDto, request.user);
  }
}
