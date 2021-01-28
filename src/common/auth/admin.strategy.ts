import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { AuthService } from './auth.service';

@Injectable()
export class AdminStrategy extends PassportStrategy(Strategy, 'admin-user') {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(request: Request): Promise<boolean> {
    return await this.authService.validateAdminUser(request);
  }
}
