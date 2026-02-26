import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Task } from '../../tasks/entities/task.entity';

@Entity({
  name: 'task_assignments',
})
@Unique(['taskId', 'userId'])
export class TaskAssignment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  taskId: number;

  @Column()
  userId: number;

  @ManyToOne(() => Task, (task) => task.taskAssignments, {
    onDelete: 'CASCADE',
  })
  task: Task;

  @ManyToOne(() => User, (user) => user.taskAssignments, {
    onDelete: 'CASCADE',
  })
  user: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
