import { Team } from 'src/common/modules/teams/entities/team.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Task } from '../../tasks/entities/task.entity';
import { TaskAssignment } from '../../task-assignments/entities/taskAssignment.entity';

@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: 'varchar',
    unique: true,
  })
  cognitoId!: string;

  @Column({
    type: 'varchar',
    unique: true,
  })
  username!: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  profilePicture!: string | null;

  @OneToMany(() => Team, (team) => team.productOwner)
  products?: Team[];

  @OneToMany(() => Team, (team) => team.projectManager)
  projects?: Team[];

  @OneToMany(() => TaskAssignment, (taskAssignment) => taskAssignment.user)
  taskAssignments?: TaskAssignment[];

  @ManyToMany(() => Team, (team) => team.users)
  teams?: Team[];

  @OneToMany(() => Task, (task) => task.assignedTo)
  assignedTasks?: Task[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
