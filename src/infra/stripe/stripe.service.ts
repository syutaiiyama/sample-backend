import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { LoggerService } from '../../common/logger/logger.service';
import {
  CreateCustomerDto,
  CreatePaymentIntentDto,
} from './dto/create-stripe.dto';

@Injectable()
export class StripeService {
  private readonly stripe: Stripe;

  constructor(private readonly logger: LoggerService) {
    this.logger.setContext('StripeService');
    this.stripe = new Stripe(process.env.NEST_APP_STRIPE_SECRET_KEY, {
      apiVersion: '2020-08-27',
    });
  }

  async createCustomer(createCustomerDto: CreateCustomerDto) {
    this.logger.info('called createCustomer', { createCustomerDto });
    const params: Stripe.CustomerCreateParams = {
      name: createCustomerDto.name,
      email: createCustomerDto.email,
    };
    const customer: Stripe.Customer = await this.stripe.customers.create(
      params,
    );
    const response = customer.id;
    this.logger.info('end createCustomer', { response });
    return response;
  }

  async createSetupIntent(customerId: string) {
    this.logger.info('called createSetupIntent', { customerId });
    const params: Stripe.SetupIntentCreateParams = {
      customer: customerId,
      payment_method_types: ['card'],
    };
    const setupIntent = await this.stripe.setupIntents.create(params);
    const response = setupIntent.client_secret;
    // NOTE: 公式ではclientSecretのログをとるのは非推奨になっている
    // NOTE: 一旦metaなしにする
    this.logger.info('end createSetupIntent');
    return response;
  }

  async createPaymentIntent(createPaymentIntentDto: CreatePaymentIntentDto) {
    this.logger.info('called createPaymentIntent', { createPaymentIntentDto });
    const params: Stripe.PaymentIntentCreateParams = {
      customer: createPaymentIntentDto.customerId,
      amount: createPaymentIntentDto.amount,
      payment_method: createPaymentIntentDto.paymentMethodId,
      currency: 'jpy',
      metadata: { orderId: '0000' },
    };
    const paymentIntent = await this.stripe.paymentIntents.create(params);
    const response = paymentIntent.client_secret;
    // NOTE: 公式ではclientSecretのログをとるのは非推奨になっている
    // NOTE: 一旦metaなしにする
    this.logger.info('end createPaymentIntent');
    return response;
  }

  async getPaymentMethods(customerId: string) {
    this.logger.info('called getPaymentMethods', { customerId });
    const params: Stripe.PaymentMethodListParams = {
      customer: customerId,
      type: 'card',
    };
    const response = await this.stripe.paymentMethods.list(params);
    this.logger.info('end getPaymentMethods', { response });
    return response.data;
  }

  async retrieveCard(paymentMethodId: string) {
    this.logger.info('called retrieveCard', { paymentMethodId });
    const response = await this.stripe.paymentMethods.detach(paymentMethodId);
    this.logger.info('end retrieveCard', { response });
    return response;
  }
}
