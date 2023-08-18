import { Column, Entity, Index } from 'typeorm';
import { AbstractEntity } from './abstract.entity';

export enum ItemType {
  PRODUCT = 'PRODUCT',
  CAMPAIGN = 'CAMPAIGN',
}
@Entity({
  name: 'orderItems',
})
@Index(['orderId', 'itemId'])
export class OrderItemEntity extends AbstractEntity {
  @Column()
  orderId: string;

  @Column()
  itemId: number;

  @Column({ default: ItemType.PRODUCT })
  itemType: ItemType;

  @Column({ nullable: true })
  price: string;

  @Column({ nullable: true })
  discount: string;

  @Column()
  quantity: number;

  @Column({ nullable: true })
  totalAmount: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: object[];
}
