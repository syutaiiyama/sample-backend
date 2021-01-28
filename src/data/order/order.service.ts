import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { LoggerService } from '../../common/logger/logger.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { Connection, Repository } from 'typeorm';
import { CartService } from '../cart/cart.service';
import { User } from '../user/user.entity';
import { OrderedProductService } from './ordered-product/ordered-product.service';
import { PaymentService } from './payment/payment.service';
import { calculatePayment } from '../../util/calculatePayment';
import { GetOrderDto } from './dto/get-order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly connection: Connection,
    private readonly loggerService: LoggerService,
    private readonly cartService: CartService,
    private readonly orderedProductService: OrderedProductService,
    private readonly paymentService: PaymentService,
  ) {
    this.loggerService.setContext('OrderService');
  }

  async create(createOrderDto: CreateOrderDto, user: User) {
    this.loggerService.info('called create');
    const orderResponse = await this.connection.transaction(async (manager) => {
      const orderRepository = manager.getRepository(Order);
      const createOrderRequest = {
        userId: user.id,
      };
      const order = await orderRepository.create(createOrderRequest);
      return await orderRepository.save(order);
    });

    const paymentResponse = await this.connection.transaction(
      async (manager) => {
        const cart = await this.cartService.findManyByUserId(user.id);
        const paymentInfo = calculatePayment(cart.cartItems);
        return await this.paymentService.createWithTransaction(
          {
            total: paymentInfo.total,
            subtotal: paymentInfo.subtotal,
            tax: paymentInfo.tax,
            shipping: paymentInfo.shipping,
            orderId: orderResponse.id,
          },
          manager,
        );
      },
    );

    const orderedProductResponse = await this.connection.transaction(
      async (manager) => {
        const cart = await this.cartService.findManyByUserId(user.id);
        return await Promise.all(
          cart.cartItems.map(async (cartItem) => {
            return await this.orderedProductService.createWithTransaction(
              {
                name: cartItem.product.name,
                price: cartItem.product.price,
                quantity: cartItem.quantity,
                orderId: orderResponse.id,
              },
              manager,
            );
          }),
        );
      },
    );

    await this.cartService.clearCart(user.id);

    return {
      orderNo: orderResponse.orderNo,
    };
  }

  async findAll() {
    this.loggerService.info('find all');
    const allOrders = await this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.user', 'user')
      .leftJoinAndSelect('user.address', 'address')
      .getMany();
    const response = await Promise.all(
      allOrders.map(async (order) => {
        const orderedProducts = await this.orderedProductService.findManyByOrderId(
          order.id,
        );
        const payment = await this.paymentService.findOne(order.id);
        return {
          user: order.user,
          orderNo: order.orderNo,
          date: order.createdAt,
          products: orderedProducts,
          payment: {
            total: payment?.total,
            subtotal: payment?.subtotal,
            tax: payment?.tax,
            shipping: payment?.shipping,
          },
        };
      }),
    );
    return response;
  }

  async findManyByUserId(userId: string) {
    this.loggerService.info('find one');
    const orders = await this.orderRepository
      .createQueryBuilder('order')
      .where('order.userId = :userId', { userId: userId })
      .leftJoinAndSelect('order.user', 'user')
      .leftJoinAndSelect('user.address', 'address')
      .getMany();
    const ordersWithProductsAndPayment = await Promise.all(
      orders.map(async (order) => {
        const orderedProducts = await this.orderedProductService.findManyByOrderId(
          order.id,
        );
        const payment = await this.paymentService.findOne(order.id);
        return {
          user: order.user,
          orderNo: order.orderNo,
          date: order.createdAt,
          products: orderedProducts,
          payment: {
            total: payment?.total,
            subtotal: payment?.subtotal,
            tax: payment?.tax,
            shipping: payment?.shipping,
          },
        };
      }),
    );
    return ordersWithProductsAndPayment;
  }

  async findOne(orderNo: string) {
    this.loggerService.info('called findOne');
    const order = await this.orderRepository
      .createQueryBuilder('order')
      .where('order.orderNo = :orderNo', { orderNo: orderNo })
      .leftJoinAndSelect('order.user', 'user')
      .leftJoinAndSelect('user.address', 'address')
      .getMany();

    const payment = await this.paymentService.findOne(order[0].id);
    const orderedProducts = await this.orderedProductService.findManyByOrderId(
      order[0].id,
    );

    return {
      user: order[0].user,
      orderNo: order[0].orderNo,
      date: order[0].createdAt,
      products: orderedProducts,
      payment: {
        total: payment?.total,
        subtotal: payment?.subtotal,
        tax: payment?.tax,
        shipping: payment?.shipping,
      },
    };
  }
}
