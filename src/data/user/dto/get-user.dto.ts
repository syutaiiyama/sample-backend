import { User } from '../user.entity';
import { CardInterface } from '../card/interface/card.interface';

export class GetUserDtoForShop {
  id: string;
  profile: ShopUserProfile;
  address: ShopUserAddress;
  card?: Array<CardInterface>;
}

export class ShopUserProfile {
  name: string;
  email: string;
}

export class ShopUserAddress {
  postalCode: string;
  prefecture: string;
  city: string;
  addressLine: string;
  building: string;
  tel: string;
}
