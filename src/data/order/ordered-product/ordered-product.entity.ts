import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';
import { Order } from '../order.entity';

@Entity()
export class OrderedProduct extends BaseEntity {
  @Column({ type: String })
  name: string;

  @Column({ type: Number })
  quantity: number;

  @Column({ type: Number })
  price: number;

  @Column({ type: String })
  orderId: string;

  @ManyToOne(() => Order)
  @JoinColumn({ name: 'orderId' })
  order?: Order;
}
