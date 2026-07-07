import { Injectable, NotFoundException } from '@nestjs/common';
import { ProjectsRepository, type Project } from './projects.repository';
import { CreateProjectDto } from './dto/create-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private readonly repo: ProjectsRepository) {}

  async create(dto: CreateProjectDto, userId: string): Promise<Project> {
    // Authorization seam (later phase): verify the user may create projects.
    return this.repo.insert({
      ...dto,
      created_by: userId,
      updated_by: userId,
    });
  }

  async findAll(): Promise<Project[]> {
    return this.repo.findAll();
  }

  async findOne(id: string): Promise<Project> {
    const project = await this.repo.findById(id);
    if (!project) throw new NotFoundException(`Project ${id} not found`);
    return project;
  }
}