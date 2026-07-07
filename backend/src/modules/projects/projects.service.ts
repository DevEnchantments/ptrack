import { Injectable, NotFoundException } from '@nestjs/common';
import { ProjectsRepository, Project } from './projects.repository';
import { CreateProjectDto } from './dto/create-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private readonly repo: ProjectsRepository) {}

  async create(dto: CreateProjectDto, userId: string): Promise<Project> {
    const { members, ...projectFields } = dto;

    const project = await this.repo.insert({
      ...projectFields,
      created_by: userId,
      updated_by: userId,
    });

    const valid = (members ?? []).filter((m) => m.role_id);
    if (valid.length > 0) {
      const rows = valid.map((m) => ({
        project_id: project.id,
        user_id: m.user_id ?? null,
        pending_name: m.user_id ? null : (m.pending_name ?? null),
        role_id: m.role_id,
        access_type: 'assigned',
        status: m.user_id ? 'active' : 'pending',
        created_by: userId,
        updated_by: userId,
      }));
      try {
        await this.repo.insertMembers(rows);
      } catch (err) {
        // Compensate: no orphan project if members fail to insert.
        await this.repo.delete(project.id);
        throw err;
      }
    }

    return project;
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