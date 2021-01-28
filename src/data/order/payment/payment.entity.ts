import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';
import { Order } from '../order.entity';

@Entity()
export class Payment extends BaseEntity {
  @Column({ type: Number })
  total: number;

  @Column({ type: Number })
  subtotal: number;

  @Column({ type: Number })
  tax: number;

  @Column({ type: Number })
  shipping: number;

  @Column({ type: String })
  orderId: string;

  @OneToOne(() => Order)
  @JoinColumn({ name: 'orderId' })
  order?: Order;
}
