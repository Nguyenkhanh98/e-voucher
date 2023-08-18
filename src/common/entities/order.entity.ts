import { Exclude } from 'class-transformer';
import { Column, Entity, Index, ManyToOne, OneToMany } from 'typeorm';
import { CustomerEntity, OrderItemEntity } from '.';
import { AbstractEntity } from './abstract.entity';
import { PaymentTransactionEntity } from './payment-transaction.entity';

export enum OrderStatus {
  ACTIVE = 'ACTIVE',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

@Entity({
  name: 'orders',
})
@Index(['customerId'])
export class OrderEntity extends AbstractEntity {
  @Column({ unique: true })
  orderId: string;

  @Column({ default: OrderStatus.ACTIVE })
  status: OrderStatus;

  @Column()
  customerId: number;

  @Column({ unique: true })
  @Exclude()
  paymentKey: string;

  @ManyToOne(() => CustomerEntity, (customer) => customer.id, {
    createForeignKeyConstraints: false,
  })
  customer: CustomerEntity;

  @OneToMany(() => OrderItemEntity, (orderItem) => orderItem.id, {
    createForeignKeyConstraints: false,
  })
  orderItems: OrderItemEntity[];

  paymentTransactions?: PaymentTransactionEntity[];
}
