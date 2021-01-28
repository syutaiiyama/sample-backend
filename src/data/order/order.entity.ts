import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Order {
  @Column('uuid')
  @Generated('uuid')
  orderNo: string;

  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ type: String, format: 'uuid' })
  readonly id?: string;

  // 作成時刻
  @CreateDateColumn({ select: true })
  readonly createdAt?: Date;

  @Column({ type: String })
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user?: User;
}
