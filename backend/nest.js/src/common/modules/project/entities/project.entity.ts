import { Task } from 'src/common/modules/tasks/entities/task.entity';
import { Team } from 'src/common/modules/teams/entities/team.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'projects',
})
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
  })
  name: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  description?: string;

  @Index()
  @Column({
    type: 'timestamp',
    name: 'start_date',
  })
  startDate: Date;

  @Index()
  @Column({
    type: 'timestamp',
    name: 'end_date',
  })
  endDate: Date;

  @OneToMany(() => Task, (task) => task.project)
  tasks?: Task[];

  @OneToMany(() => Team, (team) => team.project)
  teams?: Team[];

  @CreateDateColumn({
    type: 'timestamp',
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    name: 'updated_at',
  })
  updatedAt: Date;
}
