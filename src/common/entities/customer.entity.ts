import { Exclude } from 'class-transformer';
import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import * as bcrypt from 'bcrypt';

export enum CustomerStatus {
  NEW = 'NEW',
  ACTIVE = 'ACTIVE',
  LOCKED = 'LOCKED',
  DELETED = 'DELETED',
}

@Entity({
  name: 'customers',
})
export class CustomerEntity extends AbstractEntity {
  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  @Exclude()
  password: string;

  @Column()
  phone: string;

  @Column({ default: CustomerStatus.ACTIVE })
  status: CustomerStatus;

  @Column({ nullable: true })
  @Exclude()
  activeKey: string;

  @BeforeInsert()
  @BeforeUpdate()
  private async hashPassword() {
    const salt = await bcrypt.genSalt();
    if (this.password) {
      this.password = await bcrypt.hash(this.password, salt);
    }
  }
}
