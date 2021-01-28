import { Column, Entity, OneToOne } from 'typeorm';
import { BaseEntity } from '../common/base.entity';
import { CategoryType } from './type/category.type';
import { ProductImage } from './product-image/product-image.entity';

@Entity()
export class Product extends BaseEntity {
  @Column({ type: String })
  name: string;

  @Column({ type: String })
  category: CategoryType;

  @Column({ type: Number })
  price: number;

  @Column({ type: String })
  description: string;

  @OneToOne(() => ProductImage, (productImage) => productImage.product)
  productImage?: ProductImage;
}
