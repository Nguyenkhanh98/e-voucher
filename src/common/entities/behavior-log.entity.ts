import { Column, Entity } from 'typeorm';
import { AbstractEntity } from './abstract.entity';

@Entity({
  name: 'behaviorLogs',
})
export class BehaviorLogEntity extends AbstractEntity {
  @Column()
  apiUrl: string;

  @Column()
  method: string;

  @Column({ nullable: true })
  status: number;

  @Column({ type: 'jsonb', nullable: true })
  data: object;

  @Column({ nullable: true })
  createdBy: number;
}
