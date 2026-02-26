import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskAssignmentController } from './task-assignment.controller';
import { TaskAssignmentService } from './task-assignment.service';
import { TaskAssignment } from './entities/taskAssignment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TaskAssignment])],
  controllers: [TaskAssignmentController],
  providers: [TaskAssignmentService],
})
export class TaskAssignmentModule {}
