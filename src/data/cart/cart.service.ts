import { Injectable } from '@nestjs/common';
import { CreateCartDto, CreateCartRequest } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { User } from '../user/user.entity';
import { LoggerService } from '../../common/logger/logger.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './cart.entity';
import { Connection, Repository } from 'typeorm';
import { ProductImageService } from '../product/product-image/product-image.service';
import { GetCartDto, ShopCartItem } from './dto/get-cart.dto';
import { GetProductDto } from '../product/dto/get-product.dto';
import { calculatePayment } from '../../util/calculatePayment';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    private readonly connection: Connection,
    private readonly loggerService: LoggerService,
    private readonly productImageService: ProductImageService,
  ) {
    this.loggerService.setContext('CartService');
  }

  async create(createCartDto: CreateCartDto, user: User) {
    this.loggerService.info('called create');
    const createCartRequest: CreateCartRequest = {
      productId: createCartDto.productId,
      quantity: createCartDto.quantity,
      userId: user.id,
    };
    const response = await this.connection.transaction(async (manager) => {
      const cartRepository = manager.getRepository(Cart);
      const cartItem = await cartRepository.create(createCartRequest);
      return await cartRepository.save(cartItem);
    });
    return response;
  }

  async findManyByUserId(userId: string) {
    this.loggerService.info('find many by user id');
    const cartItems = await this.cartRepository
      .createQueryBuilder('cart')
      .where('cart.userId = :userId', {
        userId: userId,
      })
      .innerJoinAndSelect('cart.product', 'product')
      .leftJoinAndSelect('product.productImage', 'productImage')
      .getMany();
    const cartItemData: Array<ShopCartItem> = await Promise.all(
      cartItems.map(async (cart) => {
        return {
          product: {
            id: cart.id,
            name: cart.product.name,
            category: cart.product.category,
            price: cart.product.price,
            description: cart.product.description,
            imageUrl: cart.product.productImage
              ? await this.productImageService.getStorageUrl(
                  cart.product.productImage.id,
                )
              : undefined,
          },
          quantity: cart.quantity,
        };
      }),
    );
    const payment = calculatePayment(cartItemData);

    const response: GetCartDto = {
      cartItems: cartItemData,
      payment: { ...payment },
    };
    return response;
  }

  async update(id: string, updateCartDto: UpdateCartDto) {
    this.loggerService.info('called update');
    const cartData = await this.cartRepository.findOne(id);
    if (cartData === undefined) {
      this.loggerService.info('nothing cart item');
      return;
    }
    Object.assign(cartData, updateCartDto);
    const response = await this.connection.transaction(async (manager) => {
      const cartRepository = manager.getRepository(Cart);
      return await cartRepository.save(cartData);
    });
    return response;
  }

  async remove(id: string) {
    this.loggerService.info('called delete');
    await this.connection.transaction(async (manager) => {
      const cartRepository = manager.getRepository(Cart);
      return await cartRepository.delete(id);
    });
  }

  async clearCart(userId: string) {
    this.loggerService.info('called clearCart');
    await this.connection.transaction(async (manager) => {
      const cartRepository = manager.getRepository(Cart);
      await cartRepository.delete({ userId: userId });
    });
  }
}
