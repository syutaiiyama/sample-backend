import { GetProductDto } from '../../product/dto/get-product.dto';
import { GetPaymentDto } from '../../order/payment/dto/get-payment.dto';

export class GetCartDto {
  cartItems: Array<ShopCartItem>;
  payment: GetPaymentDto;
}

export class ShopCartItem {
  product: GetProductDto;
  quantity: number;
}
