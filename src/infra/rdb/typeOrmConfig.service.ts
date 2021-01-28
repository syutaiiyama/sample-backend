import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  /**
   * DBの接続設定を環境変数をもとに作成します．</br>
   * 環境変数に設定されていない場合は，デフォルトの設定値を返却します．
   * @returns 接続情報
   */
  createTypeOrmOptions(): TypeOrmModuleOptions {
    const configService = new ConfigService();
    return {
      type: 'postgres',
      url: configService.get('DATABASE_URL'),
      entities:
        process.env.NODE_ENV === 'test'
          ? ['src/data/**/*.entity.ts']
          : ['dist/data/**/*.entity.js'],
      migrationsTableName: 'migration',
      migrationsRun: process.env.NODE_ENV !== 'development',
      migrations:
        process.env.NODE_ENV === 'test'
          ? ['src/infra/rdb/migrations/*.ts']
          : ['dist/infra/rdb/migrations/*.js'],
      cli: {
        migrationsDir:
          process.env.NODE_ENV === 'test'
            ? 'src/infra/rdb/migrations'
            : 'dist/infra/rdb/migrations',
      },
      logging: true,
    };
  }
}
