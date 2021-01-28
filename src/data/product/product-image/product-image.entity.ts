import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Product } from '../product.entity';
import { BaseEntity } from '../../common/base.entity';

@Entity()
export class ProductImage extends BaseEntity {
  @Column('uuid')
  productId: string;

  @OneToOne(() => Product)
  @JoinColumn({ name: 'productId' })
  product?: Product;
}
