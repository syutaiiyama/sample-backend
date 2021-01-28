import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../common/base.entity';
import { Product } from '../product/product.entity';

@Entity()
export class Cart extends BaseEntity {
  @Column({ type: 'varchar' })
  userId: string;

  @Column({ type: String })
  productId: string;

  @Column({ type: Number })
  quantity: number;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'productId' })
  product?: Product;
}
