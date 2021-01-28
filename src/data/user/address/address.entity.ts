import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { User } from '../user.entity';
import { BaseEntity } from '../../common/base.entity';

@Entity()
export class Address extends BaseEntity {
  @Column({ type: String })
  postalCode: string;

  @Column({ type: String })
  prefecture: string;

  @Column({ type: String })
  city: string;

  @Column({ type: String })
  addressLine: string;

  @Column({ nullable: true, type: String })
  building?: string;

  @Column({ type: String })
  tel: string;

  @Column()
  userId: string;

  @OneToOne(() => User, (user) => user.address)
  @JoinColumn({ name: 'userId' })
  user?: User;
}
