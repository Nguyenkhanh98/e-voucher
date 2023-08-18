import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { Expose } from 'class-transformer';
import { VoucherTypeEntity } from './vouchery-type.entity';
import slugify from 'slugify';
import { generateKey } from '@common/utils';

@Entity({
  name: 'products',
})
@Index(['slugKey'])
export class ProductEntity extends AbstractEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Expose()
  name: string;

  @Column({ nullable: true })
  @Expose()
  nameEn: string;

  @Column({ nullable: true })
  @Expose()
  thumbnail: string;

  @Column({ nullable: true })
  voucherTypeId: number;

  @ManyToOne(() => VoucherTypeEntity, { nullable: true })
  @JoinColumn({ name: 'voucherTypeId' })
  voucherType: VoucherTypeEntity | null;

  @Column()
  @Expose()
  price: string;

  @Column()
  @Expose()
  startDate: Date;

  @Column()
  @Expose()
  endDate: Date;

  @Column()
  @Expose()
  startUseDate: Date;

  @Column()
  @Expose()
  endUseDate: Date;

  @Column({ type: 'text', nullable: true })
  @Expose()
  description: string;

  @Column({ type: 'text', nullable: true })
  @Expose()
  descriptionEn: string;

  @Column({ type: 'jsonb', nullable: true })
  @Expose()
  metadata: object;

  @Column({ nullable: true })
  @Expose()
  discount: string;

  @Column({ nullable: true })
  @Expose()
  slug: string;

  @Column({ nullable: true })
  @Expose()
  slugKey: string;

  @Column({ nullable: true })
  @Expose()
  promotion: number;

  @Column({ default: true })
  @Expose()
  active: boolean;

  @Column({ default: 9999 })
  @Expose()
  limit: number;

  @Column({ default: 0 })
  @Expose()
  used: number;

  @BeforeInsert()
  @BeforeUpdate()
  private productSlug() {
    const slug = slugify(this.name, { locale: 'vi', lower: true });
    const slugKey = generateKey();
    this.slug = slug + '-' + slugKey;
    this.slugKey = slugKey;
  }
}
