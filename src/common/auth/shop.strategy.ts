import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { AuthService } from './auth.service';
import { User } from '../../data/user/user.entity';

@Injectable()
export class ShopStrategy extends PassportStrategy(Strategy, 'shop-user') {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(request: Request): Promise<User | boolean> {
    return await this.authService.validateShopUser(request);
  }
}
