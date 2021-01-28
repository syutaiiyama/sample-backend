import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from './address.entity';
import { Connection, Repository } from 'typeorm';
import { CreateAddressDto } from './dto/create-address.dto';
import { User } from '../user.entity';
import { UpdateAddressDto } from './dto/update-address.dto';
import { LoggerService } from '../../../common/logger/logger.service';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private addressRepository: Repository<Address>,
    private readonly connection: Connection,
    private readonly loggerService: LoggerService,
  ) {
    this.loggerService.setContext('AddressService');
  }

  async create(createAddressDto: CreateAddressDto, user: User): Promise<User> {
    this.loggerService.info('called create');
    const savedAddress = await this.connection.transaction(async (manager) => {
      const addressRepository = manager.getRepository(Address);
      console.log(user);
      const address = await addressRepository.create({
        userId: user.id,
        ...createAddressDto,
      });
      return await addressRepository.save(address);
    });
    const response: User = {
      ...user,
      address: savedAddress,
    };
    return response;
  }

  async update(
    updateAddressDto: UpdateAddressDto,
    user: User,
  ): Promise<Address> {
    this.loggerService.info('called update');
    const address = await this.addressRepository.findOne({ userId: user.id });
    const response = await this.connection.transaction(async (manager) => {
      const addressRepository = manager.getRepository(Address);
      Object.assign(address, updateAddressDto);
      return await addressRepository.save(address);
    });
    return response;
  }
}
