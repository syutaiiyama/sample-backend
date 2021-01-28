import { Column, Entity, Generated } from 'typeorm';
import { BaseEntity } from '../common/base.entity';
import { StorageRecordType } from './interface/storage.interface';

@Entity()
export class Storage extends BaseEntity {
  @Column('uuid')
  @Generated('uuid')
  key: string;

  @Column('varchar')
  storageRecordType: StorageRecordType;

  @Column('uuid')
  storageRecordId: string;

  @Column('varchar')
  fileName: string;

  @Column('varchar')
  contentType: string;

  @Column('varchar')
  size: string;
}
