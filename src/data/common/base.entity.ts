import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

// 全ての Entity に共通するカラム
export abstract class BaseEntity {
  // 主キー. UUIDにて自動採番
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ type: String, format: 'uuid' })
  readonly id?: string;

  // 作成時刻
  @CreateDateColumn({ select: false })
  readonly createdAt?: Date;

  // 更新時刻
  @UpdateDateColumn({ select: false })
  readonly updatedAt?: Date;
}

export abstract class BaseEntityWithIsArchived extends BaseEntity {
  @Column({ type: 'boolean', default: false, select: false })
  isArchived?: boolean;
}
