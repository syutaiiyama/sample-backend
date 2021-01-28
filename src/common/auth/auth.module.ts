import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AdminStrategy } from './admin.strategy';
import { FirebaseModule } from '../../infra/firebase/firebase.module';
import { ShopStrategy } from './shop.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../data/user/user.entity';
import { UserModule } from '../../data/user/user.module';

@Module({
  imports: [FirebaseModule, TypeOrmModule.forFeature([User]), UserModule],
  providers: [AuthService, AdminStrategy, ShopStrategy],
})
export class AuthModule {}
