import { Column, Entity, Index } from 'typeorm';
import { AbstractEntity } from './abstract.entity';

export enum PaymentStatus {
  PROCESS = 'PROCESS',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

export enum PaymentMethod {
  GPAY = 'GPAY',
}

@Entity({ name: 'paymentTransactions' })
@Index(['transactionId'])
export class PaymentTransactionEntity extends AbstractEntity {
  @Column({ unique: true })
  transactionId: string;

  @Column()
  orderId: string;

  @Column({ default: PaymentStatus.PROCESS })
  status: PaymentStatus;

  @Column()
  amount: string;

  @Column({ default: '0' })
  paymentFee: string;

  @Column({ default: PaymentMethod.GPAY })
  paymentMethod: PaymentMethod;

  @Column({ nullable: true })
  txnResponseCode: string;

  @Column({ nullable: true, type: 'text' })
  message: string;

  @Column({ nullable: true, type: 'text' })
  paymentInfo: string;
}
