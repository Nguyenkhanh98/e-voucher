import { BeforeInsert, BeforeUpdate, Column, Entity, Index } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { CampaignItemEntity } from './campaign-item.entity';
import { ProductEntity } from './product.entity';
import slugify from 'slugify';
import { generateKey } from '@common/utils';

@Entity({
  name: 'campaigns',
})
@Index(['slugKey'])
export class CampaignEntity extends AbstractEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  nameEn: string;

  @Column({ nullable: true })
  thumbnail: string;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  descriptionEn: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: object;

  @Column({ nullable: true, default: '0' })
  discount: string;

  @Column({ default: true })
  active: boolean;

  @Column({ nullable: true })
  slug: string;

  @Column({ nullable: true })
  slugKey: string;

  @Column({ default: 9999 })
  limit: number;

  @Column({ default: 0 })
  used: number;

  campaignItems?: CampaignItemEntity[];
  campaignProducts?: ProductEntity[];

  @BeforeInsert()
  @BeforeUpdate()
  private campaignSlug() {
    const slug = slugify(this.name, { locale: 'vi', lower: true });
    const slugKey = generateKey();
    this.slug = slug + '-' + slugKey;
    this.slugKey = slugKey;
  }
}
