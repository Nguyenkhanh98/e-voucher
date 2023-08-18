import { Column, Entity, Index } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { ProductEntity } from './product.entity';

@Entity({
  name: 'campaignItems',
})
@Index(['productId', 'campaignId'])
export class CampaignItemEntity extends AbstractEntity {
  @Column()
  productId: number;

  @Column()
  campaignId: number;

  @Column()
  quantity: number;

  product?: ProductEntity;
}
