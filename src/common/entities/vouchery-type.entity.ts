import { Expose } from 'class-transformer';
import { Column, Entity, OneToMany } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { ProductEntity } from './product.entity';

export enum VoucherTypeStatus {
  ACTIVE = 'ACTIVE',
  LOCKED = 'LOCKED',
  DELETED = 'DELETED',
}

enum GroupType {
  Claim = 'claim',
  Sell = 'sell',
}

export class VoucherPssTypeBrief {
  @Expose()
  href: string;

  @Expose()
  key: string;

  @Expose()
  name: string;
}
@Entity({
  name: 'voucherTypes',
})
export class VoucherTypeEntity extends AbstractEntity {
  static _GroupType = GroupType;

  @Column()
  @Expose()
  name: string;

  @Column({ type: 'enum', enum: GroupType, default: GroupType.Claim })
  @Expose()
  groupType: GroupType;

  @Column()
  @Expose()
  type: string;

  @Column({ type: 'jsonb', nullable: true })
  @Expose()
  rules: object;

  @OneToMany(() => ProductEntity, (product) => product.voucherType)
  products: ProductEntity[];

  @Column({ type: 'jsonb' })
  @Expose()
  voucherPssType: VoucherPssTypeBrief;

  @Column({ default: VoucherTypeStatus.LOCKED })
  @Expose()
  status: VoucherTypeStatus;

  @Column({ nullable: true })
  @Expose()
  description: string;
}
