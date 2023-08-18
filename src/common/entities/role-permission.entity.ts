import { ApiKey } from '@common/constants/api-key';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { UserRole } from './user.entity';

@Entity({
  name: 'rolePermissions',
})
@Index(['role'])
export class RolePermissionEntity extends AbstractEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  role: UserRole;

  @Column({ nullable: true })
  permission: ApiKey;
}
