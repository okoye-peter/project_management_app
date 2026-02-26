import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Project } from 'src/common/modules/project/entities/project.entity';
import { User } from 'src/common/modules/users/entities/user.entity';
import { In, Repository } from 'typeorm';
import { CreateTeamDto } from './dto/create-team.dto';
import { Team } from './entities/team.entity';

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(Team)
    private teamRepository: Repository<Team>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {}

  async create(createTeamDto: CreateTeamDto) {
    const { name, productOwnerId, projectManagerId, userIds, projectId } =
      createTeamDto;

    const team = new Team();
    team.name = name;

    if (productOwnerId) {
      const productOwner = await this.userRepository.findOne({
        where: { id: productOwnerId },
      });
      if (productOwner) {
        team.productOwner = productOwner;
      }
    }

    if (projectManagerId) {
      const projectManager = await this.userRepository.findOne({
        where: { id: projectManagerId },
      });
      if (projectManager) {
        team.projectManager = projectManager;
      }
    }

    if (projectId) {
      const project = await this.projectRepository.findOne({
        where: { id: projectId },
      });
      if (project) {
        team.project = project;
      }
    }

    if (userIds && userIds.length > 0) {
      const users = await this.userRepository.find({
        where: { id: In(userIds) },
      });
      team.users = users;
    }

    return await this.teamRepository.save(team);
  }
}
