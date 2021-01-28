import { GetCartDto } from '../../cart/dto/get-cart.dto';

export class GetOrderDto {
  date: string;
  cart: Array<GetCartDto>;
}
