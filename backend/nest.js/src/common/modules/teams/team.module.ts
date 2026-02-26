import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from 'src/common/modules/project/entities/project.entity';
import { User } from 'src/common/modules/users/entities/user.entity';
import { Team } from './entities/team.entity';
import { TeamController } from './team.controller';
import { TeamService } from './team.service';

@Module({
  imports: [TypeOrmModule.forFeature([Team, User, Project])],
  providers: [TeamService],
  controllers: [TeamController],
})
export class TeamModule {}
