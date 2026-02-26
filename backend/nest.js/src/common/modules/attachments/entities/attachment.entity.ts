import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Task } from '../../tasks/entities/task.entity';
import { User } from '../../users/entities/user.entity';

@Entity({
  name: 'attachments',
})
export class Attachment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  taskId: number;

  @ManyToOne(() => Task, (task) => task.attachments, {
    onDelete: 'CASCADE',
  })
  task: Task;

  @Column({
    name: 'file_name',
  })
  fileName: string;

  @Column({
    name: 'file_url',
    type: 'text',
  })
  fileUrl: string;

  @Column()
  type: string;

  @Column()
  size: number;

  @ManyToOne(() => User, {
    onDelete: 'SET NULL',
  })
  user?: User;

  @CreateDateColumn({ name: 'uploaded_at' })
  uploadedAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
