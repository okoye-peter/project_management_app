import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';

@Module({
  providers: [TaskService],
  controllers: [TaskController],
  imports: [TypeOrmModule.forFeature([Task])],
})
export class TaskModule {}
