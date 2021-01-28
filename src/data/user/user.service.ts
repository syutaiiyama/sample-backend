import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Connection, Repository } from 'typeorm';
import { CreateUserDto, CreateUserRequest } from './dto/create-user.dto';
import {
  FirebaseApp,
  FirebaseService,
} from '../../infra/firebase/firebase.service';
import { LoggerService } from '../../common/logger/logger.service';
import { StripeService } from '../../infra/stripe/stripe.service';
import { CardService } from './card/card.service';
import { GetUserDtoForShop } from './dto/get-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Address } from './address/address.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly firebaseService: FirebaseService,
    private readonly connection: Connection,
    private readonly loggerService: LoggerService,
    private readonly stripeService: StripeService,
    private readonly cardService: CardService,
  ) {
    this.loggerService.setContext('UserService');
  }

  async create(createUserDto: CreateUserDto, idToken: string): Promise<User> {
    this.loggerService.info('called create');
    const decodedIdToken = await this.firebaseService.verifyIdToken(
      idToken,
      FirebaseApp.SHOP,
    );
    const user = await this.connection.transaction(async (manager) => {
      const stripeCustomerId = await this.stripeService.createCustomer({
        name: createUserDto.name,
        email: createUserDto.email,
      });
      const createUserRequest: CreateUserRequest = {
        uid: decodedIdToken.uid,
        name: createUserDto.name,
        email: decodedIdToken.email,
        stripeCustomerId: stripeCustomerId,
      };
      const userRepository = manager.getRepository(User);
      const user = await userRepository.create(createUserRequest);
      const response = await userRepository.save(user);

      const createAddressRequest = {
        city: ' ',
        prefecture: ' ',
        addressLine: ' ',
        tel: ' ',
        postalCode: ' ',
        userId: response.id,
      };
      const addressRepository = manager.getRepository(Address);
      const address = await addressRepository.create(createAddressRequest);
      await addressRepository.save(address);
      return response;
    });
    return user;
  }

  findAll(): Promise<User[]> {
    this.loggerService.info('called findAll');
    return this.usersRepository.find({ relations: ['address'] });
  }

  async findOne(id: string) {
    this.loggerService.info('called findOne');
    const userData = await this.usersRepository.findOne(id, {
      relations: ['address'],
    });
    const cardData = await this.cardService.getCards(userData.stripeCustomerId);
    if (cardData.length > 0) {
      const response: GetUserDtoForShop = {
        id: userData.id,
        profile: {
          name: userData.name,
          email: userData.email,
        },
        address: {
          postalCode: userData.address.postalCode,
          prefecture: userData.address.prefecture,
          city: userData.address.city,
          addressLine: userData.address.addressLine,
          tel: userData.address.tel,
          building: userData.address.building,
        },
        card: cardData,
      };
      return response;
    } else {
      const response: GetUserDtoForShop = {
        id: userData.id,
        profile: {
          name: userData.name,
          email: userData.email,
        },
        address: {
          postalCode: userData.address?.postalCode,
          prefecture: userData.address?.prefecture,
          city: userData.address?.city,
          addressLine: userData.address?.addressLine,
          tel: userData.address?.tel,
          building: userData.address?.building,
        },
      };
      return response;
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    this.loggerService.info('called update');
    const user = await this.usersRepository.findOne(id);
    const response = await this.connection.transaction(async (manager) => {
      const userRepository = manager.getRepository(User);
      const updatedUser = Object.assign(user, updateUserDto);
      return await userRepository.save(updatedUser);
    });
    return response;
  }
}
