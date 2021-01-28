import { Column, Entity, OneToOne } from 'typeorm';
import { Address } from './address/address.entity';
import { BaseEntity } from '../common/base.entity';

@Entity()
export class User extends BaseEntity {
  // Firebase Auth の uid
  @Column({ type: 'varchar', unique: true, select: false })
  uid: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  stripeCustomerId?: string;

  @OneToOne(() => Address, (address) => address.user)
  address?: Address;
}
