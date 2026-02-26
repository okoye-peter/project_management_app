import { TaskPriority } from 'src/common/enums/taskPriority.enum';
import { TaskStatus } from 'src/common/enums/taskStatus.enum';
import { Project } from 'src/common/modules/project/entities/project.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index, // Added
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { TaskAssignment } from '../../task-assignments/entities/taskAssignment.entity';
import { Attachment } from '../../attachments/entities/attachment.entity';
import { Comment } from '../../comments/entities/comment.entity';

@Entity({ name: 'tasks' })
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string; // varchar is default

  @Column({ type: 'text', nullable: true }) // Changed to text for longer descriptions
  description?: string;

  @Index() // Added Index for filtering
  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.PENDING,
  })
  status?: TaskStatus;

  @Index() // Added Index for priority filtering
  @Column({
    type: 'enum',
    enum: TaskPriority,
    default: TaskPriority.LOW,
  })
  priority?: TaskPriority;

  @Column({ type: 'varchar', array: true, default: [] })
  tags?: string[];

  @Index() // Added Index for date range concepts
  @Column({ type: 'timestamp', name: 'start_date' }) // Changed to timestamp
  startDate?: Date; // Made nullable

  @Index() // Added Index for "Due Soon" queries
  @Column({ type: 'timestamp', name: 'due_date' }) // Changed to timestamp
  dueDate?: Date; // Made nullable

  @Column({ type: 'int', nullable: true }) // Made nullable (tasks might not be pointed yet)
  points?: number;

  // Explicit ID for easier access
  @Column({ nullable: true })
  projectId: number;

  @ManyToOne(() => Project, (project) => project.tasks, {
    onDelete: 'CASCADE', // Delete task if project is deleted
  })
  @JoinColumn({ name: 'projectId' })
  project: Project;

  // Explicit ID
  @Column({ nullable: true })
  assignedToId?: number;

  @ManyToOne(() => User, (user) => user.assignedTasks, {
    onDelete: 'SET NULL', // Keep task if user is deleted
  })
  @JoinColumn({ name: 'assignedToId' })
  assignedTo?: User;

  @Column({ nullable: true })
  assignedById?: number;

  @ManyToOne(() => User, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'assignedById' })
  assignedBy?: User;

  @OneToMany(() => TaskAssignment, (taskAssignment) => taskAssignment.task)
  taskAssignments: TaskAssignment[];

  @OneToMany(() => Attachment, (attachment) => attachment.task)
  attachments: Attachment[];

  @OneToMany(() => Comment, (comment) => comment.task)
  comments: Comment[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
