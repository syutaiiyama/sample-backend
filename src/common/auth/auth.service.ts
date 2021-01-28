import { Injectable } from '@nestjs/common';
import {
  FirebaseApp,
  FirebaseService,
} from '../../infra/firebase/firebase.service';
import { User } from '../../data/user/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  constructor(
    private readonly firebaseService: FirebaseService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async validateAdminUser(request: Request): Promise<boolean> {
    try {
      const idToken = request.headers['x-auth-key'];
      // テスト用
      if (process.env.NODE_ENV !== 'production') {
        if (idToken === 'test-id-token-admin-user') return true;
      }
      await this.firebaseService.verifyIdToken(idToken, FirebaseApp.ADMIN);
      // Admin は DB で User を保持していないので、 boolean で返す
      return true;
    } catch (error) {
      return false;
    }
  }

  async validateShopUser(request: Request): Promise<User | boolean> {
    try {
      const idToken = request.headers['x-auth-key'];
      const userInfo = await this.firebaseService.verifyIdToken(
        idToken,
        FirebaseApp.SHOP,
      );
      // if (process.env.NODE_ENV !== 'staging') {
      //   if (idToken === 'test-id-token-user') return true;
      // }
      // NOTE: {scope: TRANSIENT} な LoggerModule を import した UserModule を Guards には import できない
      return await this.userRepository.findOne({ uid: userInfo.uid });
    } catch (error) {
      return false;
    }
  }
}
